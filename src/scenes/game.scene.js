import Phaser from "phaser";

import {
  COLLISION,
  BACKGROUND,
  BUILDINGS,
  DETAILS,
  TOP,
} from "../constants/game.constants";
import Player from "../actors/player.actor";
import EasyStar from "easystarjs";

export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    let stage = this;
    this.map = this.make.tilemap({key: "city"});
    this.scale = this.map.properties.find(property => property.name === "scale").value;
    this.tileset = this.map.addTilesetImage("urban", "urban", 16, 16, 0, 1);

    // Layers
    this.layers = [COLLISION, BACKGROUND, BUILDINGS, DETAILS, TOP].map(
      (id) => ({
        id,
        layer: stage.map.createLayer(id, stage.tileset),
      })
    );
    this.layers.forEach(({ layer }) => layer.setScale(this.scale));

    // Set top layer on top
    this.layers.find(({ id }) => id === TOP).layer.setDepth(10);
    // Set collision on layer
    const collisionLayer = this.layers.find(({ id }) => id === COLLISION).layer;
    collisionLayer.setCollisionByProperty({ collide: true });

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
    //this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
    this.marker.strokeCircle(
      this.map.tileWidth / 2,
      (4 * this.map.tileHeight) / 5,
      1
    );
    this.marker.setScale(this.scale);

    // Marker to show player destination
    this.destination = this.add.graphics();
    this.destination.lineStyle(1, 0xffff00, 1);
    //this.destination.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
    this.destination.strokeCircle(
      this.map.tileWidth / 2,
      (4 * this.map.tileHeight) / 5,
      1
    );
    this.destination.setVisible(false);
    this.destination.setScale(this.scale);

    // Finder
    this.finder = new EasyStar.js();

    // Set acceptable tiles on pathfinder
    const acceptableTiles = Object.entries(
      collisionLayer.tileset[0].tileProperties
    )
      .filter(([k, v]) => !v.collide)
      .map(([k]) => parseInt(k, 10) + 1);
    this.finder.setAcceptableTiles([-1, ...acceptableTiles]);

    // Set path cost
    Object.entries(collisionLayer.tileset[0].tileProperties)
      .filter(([k, v]) => v.cost)
      .forEach(([k, v]) => stage.finder.setTileCost(parseInt(k, 10) + 1, v.cost));

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
    this.player = new Player(this, {
      x: 12,
      y: 19,
    });
    this.player.setScale(this.scale);

    // Camera
    this.camera = this.cameras.main;
    this.camera.setBounds(
      0,
      0,
      this.map.width * this.map.tileWidth * this.scale,
      this.map.height * this.map.tileHeight * this.scale
    );
    this.camera.startFollow(this.player);

    this.start();
  }

  update() {
    var worldPoint = this.input.activePointer.positionToCamera(this.camera);

    // Rounds down to nearest tile
    var pointerTileX = this.map.worldToTileX(worldPoint.x);
    var pointerTileY = this.map.worldToTileY(worldPoint.y);
    this.marker.x = this.map.tileToWorldX(pointerTileX);
    this.marker.y = this.map.tileToWorldY(pointerTileY);
    this.marker.setVisible(!this.checkCollision(pointerTileX, pointerTileY));
  }

  start() {
    this.player.start();
    this.input.on("pointerup", this.handleClick, this);
  }

  handleClick(pointer) {
    let player = this.player;
    let x = this.camera.scrollX + pointer.x;
    let y = this.camera.scrollY + pointer.y;
    let toX = Math.floor(x / (this.map.tileWidth * this.scale));
    let toY = Math.floor(y / (this.map.tileHeight * this.scale));
    let fromX = Math.floor(player.x / (this.map.tileWidth * this.scale));
    let fromY = Math.floor(player.y / (this.map.tileHeight * this.scale));

    let pointerTileX = this.map.worldToTileX(x);
    let pointerTileY = this.map.worldToTileY(y);
    if (!this.checkCollision(pointerTileX, pointerTileY)) {
      this.destination.x = this.map.tileToWorldX(pointerTileX);
      this.destination.y = this.map.tileToWorldY(pointerTileY);
      this.destination.setVisible(true);

      console.log(
        "going from (" + fromX + "," + fromY + ") to (" + toX + "," + toY + ")"
      );
      this.finder.findPath(fromX, fromY, toX, toY, function (path) {
        if (path === null) {
          console.warn("Path was not found.");
        } else {
          console.log(path);
          player.move(path);
        }
      });
      this.finder.calculate();
    }
  }

  checkCollision(x, y) {
    const collisionLayer = this.layers.find(({ id }) => id === COLLISION).layer;
    let collisionTiles = Object.entries(
      collisionLayer.tileset[0].tileProperties
    )
      .filter(([k, v]) => v.collide)
      .map(([k]) => k);
    return collisionTiles.includes(
      String(this.map.getTileAt(x, y, true, COLLISION).index - 1)
    );
  }
}
