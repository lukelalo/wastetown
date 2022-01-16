import Phaser from "phaser";

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/game.constants";
import * as inventory from "../redux/reducers/inventory";

export default class Dialog extends Phaser.Scene {
  constructor() {
    super({ key: "Inventory", active: true });
  }

  get inventory() {
    return this.store.getState()["inventory"];
  }

  create() {
    this.store = this.game.store;

    // Inventory
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
  }

  handleClick(pointer, localX, localY, event) {
    this.store.dispatch(inventory.hide());
    event.stopPropagation();
  }

  update(time) {
    // Inventory
    if (this.inventory.visible) {
      this.showInventory();
    } else {
      this.hideInventory();
    }
  }

  showInventory() {
    this.background.setVisible(true);
  }

  hideInventory() {
    this.background.setVisible(false);
  }
}
