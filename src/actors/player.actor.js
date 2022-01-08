import { Directions, Status, Animations } from "../constants/game.constants";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, "player", "walkDown000");
    this.setOrigin(0, 0);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.sound = scene.sound;
    this.previousDistance = 9999;
  }

  get animation() {
    return Animations[this.status][this.direction];
  }

  get direction() {
    return this.state.direction;
  }

  get isActing() {
    return this.status === Status.ACTING;
  }

  get isAlive() {
    return this.state.isAlive;
  }

  get isWalking() {
    return this.status === Status.WALKING;
  }

  get path() {
    return this.state.path;
  }

  get position() {
    return this.state.position;
  }

  get state() {
    return this.scene.store.getState()["player"];
  }

  get status() {
    return this.state.status;
  }

  get step() {
    return this.state.path[0];
  }

  start() {
    this.changeAnimation();
  }

  changeAnimation() {
    this.currentAnimation = this.animation;
    this.play(this.animation, true);
  }

  doAction() {}

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

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.isAlive || this.isActing) {
      return;
    }

    if (this.isWalking) {
      // Update player position
      this.updatePosition();

      // Check player position
      let previousDistance = this.distance;
      this.distance = this.distanceToPosition(this.x, this.y);
      if (this.playerAtPosition(this.distance, previousDistance)) {
        this.distance = 9999;
        // Move player to exact tile position
        this.moveToExactPosition();
      }
    }

    if (this.animation !== this.currentAnimation) {
      this.changeAnimation();
    }
  }

  moveToExactPosition() {
    this.x = this.scene.map.tileToWorldX(this.step.x);
    this.y = this.scene.map.tileToWorldY(this.step.y);
    this.scene.playerAtPosition({ x: this.step.x, y: this.step.y });
  }

  distanceToPosition(x, y) {
    return Phaser.Math.Distance.Chebyshev(
      x,
      y,
      this.scene.map.tileToWorldX(this.step.x),
      this.scene.map.tileToWorldY(this.step.y)
    );
  }

  playerAtPosition(distance, previousDistance) {
    return distance < this.scene.scale || distance > previousDistance;
  }
}

export default Player;
