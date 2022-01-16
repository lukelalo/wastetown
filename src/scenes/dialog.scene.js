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
    super({ key: "Dialog", active: true });
  }

  get videogame() {
    return this.store.getState()["videogame"];
  }

  get dialogs() {
    return this.store.getState()["dialogs"];
  }

  get state() {
    return this.store.getState();
  }



  create() {
    this.store = this.game.store;
    this.letterNumber = 0;
    this.dialogText = null;
    this.letterTime = 0;
    this.choices = [];

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
    if (this.letterNumber < this.dialogText.length) {
      this.letterNumber = this.dialogText.length;
      this.text1.setText(this.dialogText);
    } else {
      this.dialogText = null;
      this.letterNumber = 0;
      this.store.dispatch(dialogs.next());
      this.background.setVisible(false);
    }
    event.stopPropagation();
  }

  update(time) {
    // Dialogs
    if (this.dialogs.length > 0 && this.dialogText === null) {
      this.showDialogs(time);
    } else if (this.dialogText === null) {
      this.hideDialogs();
    }

    // Choices
    if (
      (this.state.choices || []).length > 0 &&
      this.choices.length === 0
    ) {
      this.showChoices();
    }

    // Print dialog text
    this.printDialogText(time);
  }

  showDialogs(time) {
    const dialog = this.dialogs[0];
    this.dialogText = dialog;
    this.text1.setVisible(true);
    this.background.setVisible(true);
    this.letterTime = time;
  }

  printDialogText(time) {
    if (
      this.dialogText !== null &&
      this.letterNumber < this.dialogText.length &&
      time - this.letterTime > LETTER_TIME
    ) {
      this.nextLetter();
      this.letterTime = time;
    }
  }

  nextLetter() {
    this.letterNumber++;
    this.text1.setText(this.dialogText.substr(0, this.letterNumber));
  }

  hideDialogs() {
    this.text1.setText("");
    this.text1.setVisible(false);
  }

  showChoices() {
    let choices = this.state.choices;
    let position = 0;
    this.choices = choices.map((choice) => {
      let choiceText = this.generateText(choice.text, position++);
      choiceText.on(
        "pointerdown",
        (pointer, localX, localY, event) =>
          this.handleClickChoice(event, choice.actions),
        this
      );
      return choiceText;
    });
    this.background.setVisible(true);
  }

  handleClickChoice(event, choiceActions) {
    event.stopPropagation();
    this.choices.forEach((choice) => {
      choice.setVisible(false);
      choice.disableInteractive();
    });
    this.choices = [];
    this.background.setVisible(false);
    this.store.dispatch(behavior.set(choiceActions));
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
