import {
  Directions,
  STEP,
  TOWN_HEIGHT,
  TOWN_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH,
  SCALE,
} from "../constants/game.constants";
import EasyStar from "easystarjs";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, position) {
    super(scene, position.x, position.y, "player", "walkDown000");
    this.setOrigin(0.25, 0.3);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.isAlive = true;
    this.isActing = false;
    this.isMoving = false;
    this.currentPath = [];
    this.nextStep = undefined;

    this.finder = new EasyStar.js();
    this.finder.setAcceptableTiles([49]);
    let grid = [];
    for (let y = 0; y < TOWN_HEIGHT; y++) {
      let col = [];
      for (let x = 0; x < TOWN_WIDTH; x++) {
        col.push(scene.map.getTileAt(x, y).index);
      }
      grid.push(col);
    }
    this.finder.setGrid(grid);

    this.camera = scene.cameras.main;
    this.camera.setBounds(
      0,
      0,
      TOWN_WIDTH * TILE_WIDTH,
      TOWN_HEIGHT * TILE_HEIGHT
    );
    this.camera.startFollow(this);

    this.position = position;

    this.sound = scene.sound;
    this.x = position.x * SCALE * TILE_WIDTH + TILE_WIDTH / 2;
    this.y = position.y * SCALE * TILE_HEIGHT + TILE_HEIGHT / 2;
    this.direction = Directions.DOWN;

    this.play("idleDown");
  }

  start() {
    this.isAlive = true;
    this.isActing = false;
    this.scene.input.on("pointerup", this.handleClick, this);

    this.play("idleDown", true);
  }

  walkUp() {
    this.play("walkUp", true);
    this.direction = Directions.UP;
    this.position.y--;
  }

  walkDown() {
    this.play("walkDown", true);
    this.direction = Directions.DOWN;
    this.position.y++;
  }

  walkLeft() {
    this.play("walkLeft", true);
    this.direction = Directions.LEFT;
    this.position.x--;
  }

  walkRight() {
    this.play("walkRight", true);
    this.direction = Directions.RIGHT;
    this.position.x++;
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

    // Hide destination marker
    this.scene.destination.setVisible(false);
  }

  move(path) {
    this.currentPath = path;
    this.isMoving = true;

    // Remove first always
    this.currentPath.shift();
  }

  updatePosition() {
    if (this.x > this.position.x * SCALE * TILE_WIDTH + TILE_WIDTH / 2) {
      this.x -= SCALE;
    } else if (this.x < this.position.x * SCALE * TILE_WIDTH + TILE_WIDTH / 2) {
      this.x += SCALE;
    }

    if (this.y > this.position.y * SCALE * TILE_HEIGHT + TILE_HEIGHT / 2) {
      this.y -= SCALE;
    } else if (
      this.y <
      this.position.y * SCALE * TILE_HEIGHT + TILE_HEIGHT / 2
    ) {
      this.y += SCALE;
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.isAlive || this.isActing) {
      return;
    }

    if (!this.isMoving && this.currentPath.length > 0) {
      this.nextStep = this.currentPath.shift();
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

    this.updatePosition();

    if (this.isMoving && this.nextStep === undefined) {
      this.stop();
    }

    if (
      this.position.x === this.nextStep?.x &&
      this.position.y === this.nextStep?.y
    ) {
      this.isMoving = false;
    }
  }

  handleClick(pointer) {
    let player = this;
    let x = this.camera.scrollX + pointer.x;
    let y = this.camera.scrollY + pointer.y;
    let toX = Math.floor(x / (TILE_WIDTH * SCALE));
    let toY = Math.floor(y / (TILE_HEIGHT * SCALE));
    let fromX = Math.floor(this.x / (TILE_WIDTH * SCALE));
    let fromY = Math.floor(this.y / (TILE_HEIGHT * SCALE));

    let pointerTileX = this.scene.map.worldToTileX(x);
    let pointerTileY = this.scene.map.worldToTileY(y);
    this.scene.destination.x = this.scene.map.tileToWorldX(pointerTileX);
    this.scene.destination.y = this.scene.map.tileToWorldY(pointerTileY);
    this.scene.destination.setVisible(true);

    console.log(
      "going from (" + fromX + "," + fromY + ") to (" + toX + "," + toY + ")"
    );
    this.finder.findPath(fromX, fromY, toX, toY, function (path) {
      if (path === null) {
        console.warn("Path was not found.");
      } else {
        console.log(path);
        player.move(path);
      }
    });
    this.finder.calculate();
  }
}

export default Player;
