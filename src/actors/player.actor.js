import {
  Directions,
  STEP,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "../constants/game.constants";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, position) {
    super(scene, position.x, position.y, "player", "walkDown000");

    this.setOrigin(1, 1);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.isAlive = true;
    this.isActing = false;
    this.isMoving = false;
    this.lastMoveTime = 0;

    this.position = position;

    this.sound = scene.sound;
    this.x = position.x * TILE_WIDTH + TILE_WIDTH / 2;
    this.y = position.y * TILE_HEIGHT + TILE_HEIGHT / 2;
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
    this.position.y--;
  }

  walkDown() {
    this.play("walkDown", true);
    this.direction = Directions.DOWN;
    this.isMoving = true;
    this.position.y++;
  }

  walkLeft() {
    this.play("walkLeft", true);
    this.direction = Directions.LEFT;
    this.isMoving = true;
    this.position.x--;
  }

  walkRight() {
    this.play("walkRight", true);
    this.direction = Directions.RIGHT;
    this.isMoving = true;
    this.position.x++;
  }

  moveComplete() {
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

  updatePosition() {
    if (this.x > this.position.x * TILE_WIDTH + TILE_WIDTH / 2) {
      this.x--;
    } else if (this.x < this.position.x * TILE_WIDTH + TILE_WIDTH / 2) {
      this.x++;
    }

    if (this.y > this.position.y * TILE_HEIGHT + TILE_HEIGHT / 2) {
      this.y--;
    } else if (this.y < this.position.y * TILE_HEIGHT + TILE_HEIGHT / 2) {
      this.y++;
    }

    if (
      this.x === this.position.x * TILE_WIDTH + TILE_WIDTH / 2 &&
      this.y === this.position.y * TILE_HEIGHT + TILE_HEIGHT / 2
    ) {
      this.stop();
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

    var repeatMoveDelay = 500;

    if (time > this.lastMoveTime + repeatMoveDelay) {
      if (this.down.isDown) {
        if (
          true ||
          isTileOpenAt(this.position.x, this.position.y + TILE_HEIGHT)
        ) {
          this.lastMoveTime = time;
          this.walkDown();
        }
      } else if (this.up.isDown) {
        if (
          true ||
          isTileOpenAt(this.position.x, this.position.y - TILE_HEIGHT)
        ) {
          this.lastMoveTime = time;
          this.walkUp();
        }
      }

      if (this.left.isDown) {
        if (
          true ||
          isTileOpenAt(this.position.x - TILE_WIDTH, this.position.y)
        ) {
          this.lastMoveTime = time;
          this.walkLeft();
        }
      } else if (this.right.isDown) {
        if (
          true ||
          isTileOpenAt(this.position.x + TILE_WIDTH, this.position.y)
        ) {
          this.lastMoveTime = time;
          this.walkRight();
        }
      }
    }

    if (this.isMoving) {
      this.updatePosition();
    } else if (!this.isMoving) {
      this.stop();
    }
  }
}
