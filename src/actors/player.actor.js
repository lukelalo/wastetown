import { Directions, Status } from "../constants/game.constants";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, "player", "walkDown000");
    this.setOrigin(0, 0);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.sound = scene.sound;
    this.direction = Directions.DOWN;
    this.previousDistance = 9999;

    this.play("idleDown");
    this.status = Status.IDLE;
  }

  get isActing() {
    return this.state.isActing;
  }

  get isAlive() {
    return this.state.isAlive;
  }

  get isMoving() {
    return this.state.isMoving;
  }

  get path() {
    return this.state.path;
  }

  get position() {
    return this.state.position;
  }

  get step() {
    return this.state.path[0];
  }

  start() {
    this.play("idleDown", true);
    this.status = Status.IDLE;
  }

  walkUp() {
    this.play("walkUp", true);
    this.status = Status.WALKING;
    this.direction = Directions.UP;
  }

  walkDown() {
    this.play("walkDown", true);
    this.status = Status.WALKING;
    this.direction = Directions.DOWN;
  }

  walkLeft() {
    this.play("walkLeft", true);
    this.status = Status.WALKING;
    this.direction = Directions.LEFT;
  }

  walkRight() {
    this.play("walkRight", true);
    this.status = Status.WALKING;
    this.direction = Directions.RIGHT;
  }

  doAction() {}

  stop() {
    console.info("STOP");
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

    this.status = Status.IDLE;

    // Hide destination marker
    this.scene.destination.setVisible(false);
  }

  updatePosition() {
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

  updateState(state) {
    this.state = state;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.isAlive || this.isActing) {
      return;
    }

    if (this.isMoving && this.step && this.status === Status.WALKING) {
      // Update player position
      this.updatePosition();

      // Check player position
      let previousDistance = this.distance;
      this.distance = this.distanceToPosition(this.x, this.y);
      if (this.playerAtPosition(this.distance, previousDistance)) {
        this.distance = 9999;
        // Move player to exact tile position
        this.moveToExactPosition();

        // Stopping on each step
        if (this.path.length === 0) {
          this.stop();
        }
      }
    }

    if (this.isMoving) {
      if (
        this.step?.x > this.position.x &&
        (this.direction !== Directions.RIGHT || this.status !== Status.WALKING)
      ) {
        this.walkRight();
      } else if (
        this.step?.x < this.position.x &&
        (this.direction !== Directions.LEFT || this.status !== Status.WALKING)
      ) {
        this.walkLeft();
      } else if (
        this.step?.y > this.position.y &&
        (this.direction !== Directions.DOWN || this.status !== Status.WALKING)
      ) {
        this.walkDown();
      } else if (
        this.step?.y < this.position.y &&
        (this.direction !== Directions.UP || this.status !== Status.WALKING)
      ) {
        this.walkUp();
      }
    }
  }

  moveToExactPosition() {
    this.x = this.positionToPixels(this.step.x, this.scene.map.tileWidth);
    this.y = this.positionToPixels(this.step.y, this.scene.map.tileHeight);
    this.scene.playerAtPosition({ x: this.step.x, y: this.step.y });
  }

  distanceToPosition(x, y) {
    return Phaser.Math.Distance.Chebyshev(x, y, this.positionToPixels(this.step.x, this.scene.map.tileWidth), this.positionToPixels(this.step.y, this.scene.map.tileHeight));
  }

  playerAtPosition(distance, previousDistance) {
    return distance < this.scene.scale || distance > previousDistance;
  }

  positionToPixels(coord, tileSize) {
    return coord * this.scene.scale * tileSize;
  }
}

export default Player;
