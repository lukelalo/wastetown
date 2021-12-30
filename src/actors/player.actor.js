import { Directions, STEP } from "../constants/game.constants";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, position) {
    super(scene, position.x, position.y, "player", "walkDown000");

    this.setOrigin(1, 1);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.isAlive = true;
    this.isActing = false;
    this.isMoving = false;

    this.sound = scene.sound;
    this.x = position.x;
    this.y = position.y;
    this.direction = Directions.DOWN;

    this.spacebar = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.up = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP
    );
    this.down = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );
    this.left = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.right = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );

    this.play("idleDown");
  }

  start() {
    this.isAlive = true;
    this.isActing = false;
    this.on("animationcomplete-walkUp", this.moveComplete, this);
    this.on("animationcomplete-walkDown", this.moveComplete, this);
    this.on("animationcomplete-walkLeft", this.moveComplete, this);
    this.on("animationcomplete-walkRight", this.moveComplete, this);

    this.play("idleDown", true);
  }

  walkUp() {
    this.play("walkUp", true);
    this.direction = Directions.UP;
    this.isMoving = true;
  }

  moveUp() {
    this.y -= STEP;
    this.play("walkUp", true);
    this.direction = Directions.UP;
    this.isMoving = true;
  }

  moveDown() {
    this.y += STEP;
    this.play("walkDown", true);
    this.direction = Directions.DOWN;
    this.isMoving = true;
  }

  moveLeft() {
    this.x -= STEP;
    this.play("walkLeft", true);
    this.direction = Directions.LEFT;
    this.isMoving = true;
  }

  moveRight() {
    this.x += STEP;
    this.play("walkRight", true);
    this.direction = Directions.RIGHT;
    this.isMoving = true;
  }

  moveComplete() {
    console.log("move Complete");
    this.stop();
  }

  doAction() {}

  stop() {
    this.isMoving = false;
    this.body.stop();
    switch (this.direction) {
      case Directions.LEFT:
        this.play("idleLeft");
        break;
      case Directions.RIGHT:
        this.play("idleRight");
        break;
      case Directions.UP:
        this.play("idleUp");
        break;
      case Directions.DOWN:
      default:
        this.play("idleDown");
        break;
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.isAlive || this.isActing) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.spacebar) && !this.isActing) {
      this.doAction();
      return;
    }

    if (this.up.isDown) {
      this.moveUp();
    } else if (this.down.isDown) {
      this.moveDown();
    } else if (this.left.isDown) {
      this.moveLeft();
    } else if (this.right.isDown) {
      this.moveRight();
    } else if (!this.isMoving) {
      this.stop();
    }
  }
}
