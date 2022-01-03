import Phaser from "phaser";

import {
  TOWN_WIDTH,
  TOWN_HEIGHT,
  TILE_WIDTH,
  TILE_HEIGHT,
  SCALE
} from "../constants/game.constants";
import Player from "../actors/player.actor";

export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    let stage = this;
    this.map = this.make.tilemap({
      key: 'city',
      tileWidth: TILE_WIDTH,
      tileHeight: TILE_HEIGHT,
      width: TOWN_WIDTH,
      height: TOWN_HEIGHT,
    });
    this.tileset = this.map.addTilesetImage("urban", "urban", 16, 16, 0, 1);
    this.layers = ["Collision", "Background", "Base", "Buildings", "Details"].map(layer => stage.map.createLayer(layer, stage.tileset))

    // Marker that will follow the mouse
    this.marker = this.add.graphics();
    this.marker.lineStyle(1, 0xffffff, 1);
    this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);

    // Marker to show player destination
    this.destination = this.add.graphics();
    this.destination.lineStyle(1, 0xffff00, 1);
    this.destination.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
    this.destination.setVisible(false);

    this.player = new Player(this, {
      x: 0,
      y: 0,
    });

    this.player.setScale(SCALE);
    this.layers.forEach(layer => layer.setScale(SCALE));
    this.marker.setScale(SCALE);
    this.destination.setScale(SCALE);
    this.start();
  }

  update() {
    var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Rounds down to nearest tile
    var pointerTileX = this.map.worldToTileX(worldPoint.x);
    var pointerTileY = this.map.worldToTileY(worldPoint.y);
    this.marker.x = this.map.tileToWorldX(pointerTileX);
    this.marker.y = this.map.tileToWorldY(pointerTileY);
    this.marker.setVisible(!this.checkCollision(pointerTileX,pointerTileY));
  }

  start() {
    this.player.start();
  }

  checkCollision(x, y) {
    let scene = this;
    let collisionTiles = [...new Set(scene.map.getLayer("Collision").data.map(col => col.map(tile => tile.index)).flat())].filter(item => item >= 0);
    return collisionTiles.includes(this.map.getTileAt(x, y, true, "Collision").index);
  }
}
