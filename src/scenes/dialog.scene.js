import Phaser from "phaser";

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/game.constants";
import * as actions from "../redux/actions";

export default class Dialog extends Phaser.Scene {
  constructor() {
    super({ key: "Dialog", active: true });
  }

  get videogame() {
    return this.store.getState()["videogame"];
  }

  create() {
    this.store = this.game.store;

    // Dialog
    this.background = this.add.graphics();
    this.background.fillStyle(0x000000, 0.5);
    this.background.fillRect(
      0,
      (SCREEN_HEIGHT * 2) / 3,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );
    this.background.setVisible(false);
    this.background.setInteractive();

    this.text1 = this.add.text(SCREEN_WIDTH / 6, (SCREEN_HEIGHT * 3) / 4, "", {
      fontFamily: "Orbitron",
      fontSize: 30,
      color: "#e3f2ed",
    });
    this.text1.setOrigin(0.5, 0.5);
    this.text1.setStroke("#203c5b", 6);
    this.text1.setShadow(2, 2, "#2d2d2d", 4, true, false);
    this.text1.setDepth(50);
    this.text1.setInteractive();
    this.text1.setVisible(false);
    this.text1.on("pointerdown", (pointer, localX, localY, event) => {
      console.log("Click on dialog");
      this.store.dispatch(actions.videogameNextAction());
      event.stopPropagation();
    });
  }

  update() {
    if (this.videogame.actions.length > 0) {
      const action = this.videogame.actions[0];
      this.text1.setText(action.text);
      this.text1.setVisible(true);
      this.background.setVisible(true);
    } else {
      this.text1.setVisible(false);
      this.background.setVisible(false);
    }
  }
}
