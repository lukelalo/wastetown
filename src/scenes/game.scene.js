import Phaser from "phaser";

import {
  TOWN_WIDTH,
  TOWN_HEIGHT,
  TILE_WIDTH,
  TILE_HEIGHT,
  SCALE,
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
    this.map = this.make.tilemap({
      key: "city",
      tileWidth: TILE_WIDTH,
      tileHeight: TILE_HEIGHT,
      width: TOWN_WIDTH,
      height: TOWN_HEIGHT,
    });
    this.tileset = this.map.addTilesetImage("urban", "urban", 16, 16, 0, 1);

    // Layers
    this.layers = [COLLISION, BACKGROUND, BUILDINGS, DETAILS, TOP].map(
      (id) => ({
        id,
        layer: stage.map.createLayer(id, stage.tileset),
      })
    );
    this.layers.forEach(({ layer }) => layer.setScale(SCALE));

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
    this.marker.setScale(SCALE);

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
    this.destination.setScale(SCALE);

    // Finder
    const finder = new EasyStar.js();

    // Set acceptable tiles on pathfinder
    const acceptableTiles = Object.entries(
      collisionLayer.tileset[0].tileProperties
    )
      .filter(([k, v]) => !v.collide)
      .map(([k]) => parseInt(k, 10) + 1);
    finder.setAcceptableTiles([-1, ...acceptableTiles]);

    // Set path cost
    Object.entries(collisionLayer.tileset[0].tileProperties)
      .filter(([k, v]) => v.cost)
      .forEach(([k, v]) => finder.setTileCost(parseInt(k, 10) + 1, v.cost));

    const grid = [];
    for (let y = 0; y < TOWN_HEIGHT; y++) {
      let col = [];
      for (let x = 0; x < TOWN_WIDTH; x++) {
        col.push(this.map.getTileAt(x, y, true, COLLISION).index);
      }
      grid.push(col);
    }
    finder.setGrid(grid);

    // Player
    this.player = new Player(this, {
      x: 12,
      y: 19,
    });
    this.player.setScale(SCALE);
    this.player.setFinder(finder);

    this.start();
  }

  update() {
    var worldPoint = this.input.activePointer.positionToCamera(
      this.cameras.main
    );

    // Rounds down to nearest tile
    var pointerTileX = this.map.worldToTileX(worldPoint.x);
    var pointerTileY = this.map.worldToTileY(worldPoint.y);
    this.marker.x = this.map.tileToWorldX(pointerTileX);
    this.marker.y = this.map.tileToWorldY(pointerTileY);
    this.marker.setVisible(!this.checkCollision(pointerTileX, pointerTileY));
  }

  start() {
    this.player.start();
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
