import Phaser from "phaser";

import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  LETTER_TIME,
} from "../constants/game.constants";
import * as behavior from "../redux/reducers/behavior";
import * as dialogs from "../redux/reducers/dialogs";

export default class Dialog extends Phaser.Scene {
  constructor() {
    super({ key: "Inventary", active: true });
  }

  get videogame() {
    return this.store.getState()["videogame"];
  }

  get inventary() {
    return this.store.getState()["inventary"];
  }

  get state() {
    return this.store.getState();
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
    this.background.setInteractive(
      new Phaser.Geom.Rectangle(
        0,
        (SCREEN_HEIGHT * 2) / 3,
        SCREEN_WIDTH,
        SCREEN_HEIGHT / 3
      ),
      Phaser.Geom.Rectangle.Contains
    );
    this.background.on("pointerdown", this.handleClick, this);

    this.text1 = this.generateText("", 0);
    this.text1.setVisible(false);
    this.text1.on("pointerdown", this.handleClick, this);
  }

  handleClick(pointer, localX, localY, event) {
    this.store.dispatch(inventary.hide());
    event.stopPropagation();
  }

  update(time) {
    // Inventary
    if (this.inventary.visible) {
      this.showInventary();
    } else {
      this.hideInventary();
    }
  }

  showInventary() {
    this.text1.setVisible(true);
    this.background.setVisible(true);
  }

  hideInventary() {
    this.text1.setText("");
    this.text1.setVisible(false);
  }

  generateText(text, position) {
    let textGraphic = this.add.text(
      SCREEN_WIDTH / 20,
      (SCREEN_HEIGHT * 3) / 4 + position * 50,
      "",
      {
        fontFamily: "Sans",
        fontSize: 30,
        color: "#e3f2ed",
      }
    );
    textGraphic.setOrigin(0, 0);
    textGraphic.setStroke("#203c5b", 6);
    textGraphic.setShadow(2, 2, "#2d2d2d", 4, true, false);
    textGraphic.setDepth(50);
    textGraphic.setInteractive();
    textGraphic.setStyle({
      wordWrap: {
        width: SCREEN_WIDTH - SCREEN_WIDTH / 10,
        useAdvancedWrap: true,
      },
    });
    textGraphic.setText(text);
    return textGraphic;
  }
}
