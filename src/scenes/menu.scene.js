import Phaser from "phaser";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../constants/game.constants";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const logo = this.add.image(
      (SCREEN_WIDTH * 6) / 7,
      (SCREEN_HEIGHT * 6) / 7,
      "logo"
    );
    logo.scale = 0.3;

    const title = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 4,
      "Wastetown",
      { fontFamily: "Arial", fontSize: 74, color: "#e3f2ed" }
    );
    title.setOrigin(0.5, 0.5);
    title.setStroke("#203c5b", 6);
    title.setShadow(2, 2, "#2d2d2d", 4, true, false);

    const newGame = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      "New Game",
      { fontFamily: "Arial", fontSize: 40, color: "#e3f2ed" }
    );
    newGame.setOrigin(0.5, 0.5);
    newGame.setStroke("#203c5b", 6);
    newGame.setShadow(2, 2, "#2d2d2d", 4, true, false);
    newGame.setInteractive();
    newGame.once("pointerdown", () => {
      console.log("Game starts");
      this.scene.start("Game");
    });
  }
}
