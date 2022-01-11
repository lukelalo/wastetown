import Phaser from "phaser";

import { COLLISION, Directions } from "../constants/game.constants";
import Player from "../actors/player.actor";
import EasyStar from "easystarjs";
import * as actions from "../redux/actions";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }

  get videogame() {
    return this.store.getState()["videogame"];
  }

  get quests() {
    return this.store.getState()["quests"];
  }

  get currentMap() {
    return this.store.getState()["map"];
  }

  create() {
    this.store = this.game.store;
    let stage = this;
    this.map = this.make.tilemap({ key: this.currentMap.name });
    this.mapName = this.currentMap.name;
    this.mapEvents = this.game.cache.json.get(`${this.currentMap.name}Events`);
    this.scale = this.getProperty(this.map, "scale");
    let tilesetName = this.getProperty(this.map, "tileset");
    let tileset = this.map.tilesets.find((item) => item.name === tilesetName);
    let tilesetImage = this.map.addTilesetImage(
      tilesetName,
      tilesetName,
      tileset.tileWidth,
      tileset.tileHeight,
      tileset.tileMargin,
      tileset.tileSpacing
    );
    const TILE_WIDTH = this.map.tileWidth;
    const TILE_HEIGHT = this.map.tileHeight;

    // Layers
    this.layers = this.map.layers.map((data) => {
      const id = data.name;
      const layer = stage.map.createLayer(id, tilesetImage);
      layer
        .setScale(this.scale)
        .setCollisionByProperty({ collide: true })
        .setVisible(this.getProperty(data, "visible", true))
        .setDepth(this.getProperty(data, "depth", 0));
      return { id, data, layer };
    });

    // Create worldLayer collision graphic above the player, but below the help text
    if (this.game.config.physics.arcade.debug) {
      const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
      collisionLayer.renderDebug(graphics, {
        // Color of non-colliding tiles
        tileColor: null,
        // Color of colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        // Color of colliding face edges
        faceColor: new Phaser.Display.Color(40, 39, 37, 255),
      });
    }

    // Marker that will follow the mouse
    this.marker = this.add.graphics();
    this.marker.lineStyle(1, 0xffffff, 1);
    //this.marker.strokeRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    this.marker.lineBetween(5, 5, TILE_WIDTH - 5, TILE_HEIGHT - 5);
    this.marker.lineBetween(TILE_WIDTH - 5, 5, 5, TILE_HEIGHT - 5);
    this.marker.setScale(this.scale);

    // Marker to show player destination
    this.destination = this.add.graphics();
    this.destination.lineStyle(1, 0xffff00, 1);
    //this.destination.strokeRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    this.destination.lineBetween(5, 5, TILE_WIDTH - 5, TILE_HEIGHT - 5);
    this.destination.lineBetween(TILE_WIDTH - 5, 5, 5, TILE_HEIGHT - 5);
    this.destination.setVisible(false);
    this.destination.setScale(this.scale);

    // Finder
    this.finder = new EasyStar.js();

    // Set acceptable tiles on pathfinder
    const collisionLayer = this.layers.find(({ id }) => id === COLLISION).layer;
    const acceptableTiles = Object.entries(
      collisionLayer.tileset[0].tileProperties
    )
      .filter(([k, v]) => !v.collide)
      .map(([k]) => parseInt(k, 10) + 1);
    this.finder.setAcceptableTiles([-1, ...acceptableTiles]);

    // Set path cost
    Object.entries(collisionLayer.tileset[0].tileProperties)
      .filter(([k, v]) => v.cost)
      .forEach(([k, v]) =>
        stage.finder.setTileCost(parseInt(k, 10) + 1, v.cost)
      );

    const grid = [];
    for (let y = 0; y < this.map.height; y++) {
      let col = [];
      for (let x = 0; x < this.map.width; x++) {
        col.push(this.map.getTileAt(x, y, true, COLLISION).index);
      }
      grid.push(col);
    }
    this.finder.setGrid(grid);

    // Player
    this.dispatch(
      actions.playerInit({
        position: this.currentMap.position,
        direction: this.currentMap.direction,
      })
    );
    this.player = new Player(this);
    this.player.setScale(this.scale);
    this.player.moveToExactPosition();
    this.player.setFinder(this.finder);

    // Camera
    this.camera = this.cameras.main;
    this.camera.setBounds(
      0,
      0,
      this.map.width * TILE_WIDTH * this.scale,
      this.map.height * TILE_HEIGHT * this.scale
    );
    this.camera.startFollow(this.player);

    this.start();
  }

  dispatch(action) {
    this.store.dispatch(action);
  }

  getProperty(item, propertyName, defaultValue) {
    let property = item.properties.find(
      (property) => property.name === propertyName
    );
    return property === undefined ? defaultValue : property.value;
  }

  update() {
    var worldPoint = this.input.activePointer.positionToCamera(this.camera);

    // Rounds down to nearest tile
    var pointerTileX = this.map.worldToTileX(worldPoint.x);
    var pointerTileY = this.map.worldToTileY(worldPoint.y);
    this.marker.x = this.map.tileToWorldX(pointerTileX);
    this.marker.y = this.map.tileToWorldY(pointerTileY);
    this.marker.setVisible(
      !this.player.isActing && !this.checkCollision(pointerTileX, pointerTileY)
    );

    // Check map name
    if (this.mapName !== this.currentMap.name) {
      this.scene.restart();
    }
  }

  start() {
    this.player.start();
    this.input.on("pointerdown", this.handleClick, this);
  }

  handleClick(pointer) {
    // Avoid pointers on actions
    if (this.player.isActing) return;

    const x = this.map.worldToTileX(this.camera.scrollX + pointer.x);
    const y = this.map.worldToTileY(this.camera.scrollY + pointer.y);

    if (!this.checkCollision(x, y)) {
      this.dispatch(
        actions.videogameSetActions([
          actions.movePlayer({ position: { x, y } }),
        ])
      );
    } else {
      // Check event when clicking at position
      this.checkEventAtPosition({position: {x, y}}, "clickAt");
    }
  }

  checkEventAtPosition(payload, coordinates) {
    const eventAtPosition = this.mapEvents.find(
      (e) => e[coordinates]?.x === payload.position.x && e[coordinates]?.y === payload.position.y
    );
    if (eventAtPosition) {
      // Execute actions from event
      this.executeEventActions(eventAtPosition.actions);
    }
  }

  executeEventActions(eventActions) {
    this.dispatch(actions.videogameSetActions(eventActions));
  }

  calculatePath({ x, y }, callback) {
    const { nextStep, position } = this.player;
    const fromX = nextStep ? nextStep.x : position.x;
    const fromY = nextStep ? nextStep.y : position.y;
    this.destination.x = this.map.tileToWorldX(x);
    this.destination.y = this.map.tileToWorldY(y);
    this.destination.setVisible(true);

    console.log(`going from (${fromX},${fromY}) to (${x},${y})`);
    this.finder.findPath(fromX, fromY, x, y, callback);
    this.finder.calculate();
  }

  playerAtPosition(payload) {
    this.dispatch(actions.playerPosition(payload));
    // Check event at current position
    this.checkEventAtPosition(payload, "at");
    console.info("Current position is ", payload.position);
    console.info("Next step is ", this.player.nextStep);
  }

  playerSetPath(payload) {
    this.dispatch(actions.playerPath(payload));
  }

  checkCollision(x, y) {
    const collisionLayer = this.layers.find(({ id }) => id === COLLISION).layer;
    let collisionTiles = Object.entries(
      collisionLayer.tileset[0].tileProperties
    )
      .filter(([k, v]) => v.collide)
      .map(([k]) => k);
    return collisionTiles.includes(
      String(this.map.getTileAt(x, y, true, COLLISION)?.index - 1)
    );
  }
}
