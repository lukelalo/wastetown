import Phaser from "phaser";
import logoImg from "../assets/images/phaserLogo.png";
import basicImg from "../assets/tilesets/basic.png";
import urbanTileset from "../assets/tilesets/urban.png";
import cityMap from "../assets/maps/city.json";
import playerPng from "../assets/sprites/player.png";
import playerJson from "../assets/sprites/player.json";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../constants/game.constants";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.text = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      "Loading ...",
      { fontFamily: "Orbitron", fontSize: 30, color: "#e3f2ed" }
    );
    this.text.setOrigin(0.5, 0.5);
    this.text.setStroke("#203c5b", 6);
    this.text.setShadow(2, 2, "#2d2d2d", 4, true, false);

    this.load.image("logo", logoImg);
    this.load.image("basic", basicImg);
    this.load.atlas("player", playerPng, playerJson);

    // load the PNG file
    this.load.image("urban", urbanTileset);

    // load the JSON file
    this.load.tilemapTiledJSON("city", cityMap);
  }

  create() {
    this.anims.create({
      key: "idleLeft",
      frames: this.anims.generateFrameNames("player", {
        prefix: "walkLeft",
        start: 0,
        end: 0,
        zeroPad: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "idleDown",
      frames: this.anims.generateFrameNames("player", {
        prefix: "walkDown",
        start: 2,
        end: 2,
        zeroPad: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "idleUp",
      frames: this.anims.generateFrameNames("player", {
        prefix: "walkUp",
        start: 0,
        end: 0,
        zeroPad: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "idleRight",
      frames: this.anims.generateFrameNames("player", {
        prefix: "walkRight",
        start: 0,
        end: 0,
        zeroPad: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walkLeft",
      frames: this.anims.generateFrameNames("player", {
        prefix: "walkLeft",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walkDown",
      frames: this.anims.generateFrameNames("player", {
        prefix: "walkDown",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walkUp",
      frames: this.anims.generateFrameNames("player", {
        prefix: "walkUp",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walkRight",
      frames: this.anims.generateFrameNames("player", {
        prefix: "walkRight",
        start: 0,
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    if (this.sound.locked) {
      this.text.setText("Click to start");
      this.input.once("pointerdown", () => {
        this.scene.start("Menu");
      });
    } else {
      this.scene.start("Menu");
    }
  }
}
