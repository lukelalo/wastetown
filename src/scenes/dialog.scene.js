import Phaser from "phaser";

import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../constants/game.constants";
import * as actions from "../redux/actions";

export default class Dialog extends Phaser.Scene {
  constructor() {
    super({key: "Dialog", active: true});
  }

  get videogame() {
    return this.store.getState()["videogame"];
  }

  create() {
    this.store = this.game.store;

    // Dialog
    this.dialog = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      "",
      {
        fontFamily: "Orbitron",
        fontSize: 30,
        color: "#e3f2ed",
      }
    );
    this.dialog.setOrigin(0, 0);
    this.dialog.setStroke("#203c5b", 6);
    this.dialog.setShadow(2, 2, "#2d2d2d", 4, true, false);
    this.dialog.setBackgroundColor("#2d2d2d");
    this.dialog.setInteractive();
    this.dialog.setDepth(50);
    //this.dialog.setDisplaySize(SCREEN_WIDTH, (2 * SCREEN_HEIGHT) / 3);
    this.dialog.on("pointerdown", (pointer, localX, localY, event) => {
      console.log("Click on dialog");
      this.store.dispatch(actions.playerIdle());
      event.stopPropagation();
    });
    this.dialog.setVisible(false);
  }

  update() {
    if (this.videogame.actions.length > 0) {
      const action = this.videogame.actions[0];
      this.dialog.setX(0);
      this.dialog.setY((2 * SCREEN_HEIGHT) / 3);
      this.dialog.setText(action.id);
      this.dialog.setVisible(true);
    } else {
      this.dialog.setVisible(false);
    }
  }
}
