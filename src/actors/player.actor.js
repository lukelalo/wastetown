import {
  Directions,
} from "../constants/game.constants";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, position) {
    super(scene, position.x, position.y, "player", "walkDown000");
    this.setOrigin(0, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.isAlive = true;
    this.isActing = false;
    this.isMoving = false;
    this.currentPath = [];
    this.nextStep = undefined;

    this.position = position;

    this.sound = scene.sound;
    this.x = this.positionToPixels(this.position.x, scene.map.tileWidth);
    this.y = this.positionToPixels(this.position.y, scene.map.tileHeight);
    this.direction = Directions.DOWN;

    this.play("idleDown");
  }

  start() {
    this.isAlive = true;
    this.isActing = false;
    this.play("idleDown", true);
  }

  walkUp() {
    this.play("walkUp", true);
    this.direction = Directions.UP;
    this.position.y--;
    this.isMoving = true;
  }

  walkDown() {
    this.play("walkDown", true);
    this.direction = Directions.DOWN;
    this.position.y++;
    this.isMoving = true;
  }

  walkLeft() {
    this.play("walkLeft", true);
    this.direction = Directions.LEFT;
    this.position.x--;
    this.isMoving = true;
  }

  walkRight() {
    this.play("walkRight", true);
    this.direction = Directions.RIGHT;
    this.position.x++;
    this.isMoving = true;
  }

  doAction() {}

  stop() {
    console.info("STOP");
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

    // Hide destination marker
    this.scene.destination.setVisible(false);
  }

  move(path) {
    this.currentPath = path;

    // Remove first always
    this.currentPath.shift();
  }

  updatePosition() {
    if (this.isMoving) {
      switch (this.direction) {
        case Directions.LEFT:
          this.x -= this.scene.scale;
          break;
        case Directions.RIGHT:
          this.x += this.scene.scale;
          break;
        case Directions.UP:
          this.y -= this.scene.scale;
          break;
        case Directions.DOWN:
          this.y += this.scene.scale;
          break;
      }
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.isAlive || this.isActing) {
      return;
    }

    if (!this.isMoving && this.currentPath.length > 0) {
      this.nextStep = this.currentPath.shift();
      console.info(this.nextStep);
      if (this.nextStep?.x > this.position.x) {
        this.walkRight();
      } else if (this.nextStep?.x < this.position.x) {
        this.walkLeft();
      } else if (this.nextStep?.y > this.position.y) {
        this.walkDown();
      } else if (this.nextStep?.y < this.position.y) {
        this.walkUp();
      }
    }

    if (this.isMoving) {
      // Update player position
      this.updatePosition();

      // Check player position
      if (this.playerAtPosition(this.x, this.y)) {
        // Move player to exact tile position
        this.x = this.positionToPixels(this.position.x, this.scene.map.tileWidth);
        this.y = this.positionToPixels(this.position.y, this.scene.map.tileHeight);

        // Stopping on each step
        if (this.currentPath.length === 0) {
          this.stop();
        } else {
          this.isMoving = false;
        }
      }
    }
  }

  playerAtPosition(x, y) {
    return (
      Math.abs(this.positionToPixels(this.position.x, this.scene.map.tileWidth) - x)  < this.scene.scale &&
      Math.abs(this.positionToPixels(this.position.y, this.scene.map.tileHeight) - y) < this.scene.scale
    );
  }

  positionToPixels(coord, tileSize) {
    return coord * this.scene.scale * tileSize;
  }
}

export default Player;
