import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./constants/game.constants";
import bootScene from "./scenes/boot.scene";
import preloaderScene from "./scenes/preloader.scene";
import menuScene from "./scenes/menu.scene";
import gameScene from "./scenes/game.scene";
import dialogScene from "./scenes/dialog.scene";
import inventoryScene from "./scenes/inventory.scene";
import Game from "./game/main.game";
import "./fonts.css";

const config = {
  type: Phaser.AUTO,
  parent: "Wastetown",
  pixelArt: true,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  scene: [
    bootScene,
    preloaderScene,
    menuScene,
    gameScene,
    dialogScene,
    inventoryScene,
  ],
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
};

const game = new Game(config);
