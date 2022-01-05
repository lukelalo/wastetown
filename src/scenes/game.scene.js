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
    this.layers = ["Collision", "Background", "Buildings", "Details", "Top"].reduce((all, layer) => ({...all, [layer]: stage.map.createLayer(layer, stage.tileset)}), {});

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
    Object.values(this.layers).forEach(layer => layer.setScale(SCALE));
    // Set top layer on top
    this.layers["Top"].setDepth(10);
    // Set collision on layer
    this.layers["Collision"].setCollisionByProperty({ collide: true });

    // Create worldLayer collision graphic above the player, but below the help text
    if (this.game.config.physics.arcade.debug) {
      const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
      this.layers["Collision"].renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
      });
    }


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
    let collisionTiles = Object.entries(this.layers["Collision"].tileset[0].tileProperties).filter(([k, v]) => v.collide).map(([k]) => k);
    return collisionTiles.includes(String(this.map.getTileAt(x, y, true, "Collision").index - 1));
  }
}
