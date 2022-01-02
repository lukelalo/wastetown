import Phaser from "phaser";
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  TOWN_WIDTH,
  TOWN_HEIGHT,
  Town,
} from "../constants/game.constants";
import Player from "../actors/player.actor";

export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.map = this.make.tilemap({
      tileWidth: 16,
      tileHeight: 16,
      width: TOWN_WIDTH,
      height: TOWN_HEIGHT,
    });
    this.tileset = this.map.addTilesetImage("town", "town", 16, 16, 0, 0);
    this.layer = this.map.createBlankLayer("Layer 1", this.tileset);
    this.layer.fill(6);

    this.player = new Player(this, {
      x: SCREEN_WIDTH / 2,
      y: SCREEN_HEIGHT / 2,
    });
    this.player.setScale(2);
    this.layer.setScale(2);
    this.player.x = this.map.tileToWorldX(13);
    this.player.y = this.map.tileToWorldY(10);
    this.start();
  }

  start() {
    this.player.start();
  }
}
