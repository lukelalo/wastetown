import Phaser from "phaser";
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  TOWN_WIDTH,
  TOWN_HEIGHT,
  TILE_WIDTH,
  TILE_HEIGHT,
  Town,
} from "../constants/game.constants";
import Player from "../actors/player.actor";

export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.map = this.make.tilemap({
      tileWidth: TILE_WIDTH,
      tileHeight: TILE_HEIGHT,
      width: TOWN_WIDTH,
      height: TOWN_HEIGHT,
    });
    this.tileset = this.map.addTilesetImage("town", "basic", 16, 16, 0, 0);
    this.layer = this.map.createBlankLayer("Layer 1", this.tileset);
    this.layer.fill(49);

    this.player = new Player(this, {
      x: 1,
      y: 1,
    });
    this.player.setScale(2);
    this.layer.setScale(2);
    this.start();
  }

  start() {
    this.player.start();
  }
}
