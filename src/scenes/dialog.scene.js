import Phaser from "phaser";

import { SCREEN_HEIGHT, SCREEN_WIDTH, LETTER_TIME } from "../constants/game.constants";
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
    this.letterNumber = 0;
    this.actionText = null;
    this.letterTime = 0;

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
    this.background.setInteractive(new Phaser.Geom.Rectangle(0, (SCREEN_HEIGHT * 2) / 3, SCREEN_WIDTH, SCREEN_HEIGHT / 3), Phaser.Geom.Rectangle.Contains);
    this.background.on("pointerdown", this.handleClick, this);

    this.text1 = this.add.text(SCREEN_WIDTH / 20, (SCREEN_HEIGHT * 3) / 4, "", {
      fontFamily: "Orbitron",
      fontSize: 30,
      color: "#e3f2ed",
    });
    this.text1.setOrigin(0, 0);
    this.text1.setStroke("#203c5b", 6);
    this.text1.setShadow(2, 2, "#2d2d2d", 4, true, false);
    this.text1.setDepth(50);
    this.text1.setInteractive();
    this.text1.setVisible(false);
    this.text1.setStyle({wordWrap: { width: SCREEN_WIDTH - SCREEN_WIDTH / 10, useAdvancedWrap: true }});
    this.text1.on("pointerdown", this.handleClick, this);
  }

  handleClick(pointer, localX, localY, event) {
    if (this.letterNumber < this.actionText.length) {
      this.letterNumber = this.actionText.length;
      this.text1.setText(this.actionText);
    } else {
      this.actionText = null;
      this.letterNumber = 0;
      this.store.dispatch(actions.videogameNextAction());
    }
    event.stopPropagation();
  }

  update(time) {
    if (this.videogame.actions.length > 0 && this.actionText === null) {
      const action = this.videogame.actions[0];
      this.actionText = action.text;
      this.text1.setVisible(true);
      this.background.setVisible(true);
      this.letterTime = time;
    } else if (this.actionText === null) {
      this.text1.setText("");
      this.text1.setVisible(false);
      this.background.setVisible(false);
    }

    if (this.actionText !== null && this.letterNumber < this.actionText.length && time - this.letterTime > LETTER_TIME) {
      this.nextLetter();
      this.letterTime = time;
    }
  }

  nextLetter() {
    this.letterNumber++;
    this.text1.setText(this.actionText.substr(0, this.letterNumber));
  }
}
