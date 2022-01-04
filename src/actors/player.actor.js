import {
  Directions,
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
    this.setOrigin(0, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.isAlive = true;
    this.isActing = false;
    this.isMoving = false;
    this.currentPath = [];
    this.nextStep = undefined;

    this.finder = new EasyStar.js();

    // Set acceptable tiles on pathfinder
    let acceptableTiles = Object.entries(scene.layers["Collision"].tileset[0].tileProperties)
      .filter(([k, v]) => !v.collide)
      .map(([k]) => parseInt(k, 10) + 1);
    this.finder.setAcceptableTiles([-1, ...acceptableTiles]);

    // Set path cost
    let player = this;
    Object.entries(scene.layers["Collision"].tileset[0].tileProperties)
      .filter(([k, v]) => v.cost)
      .forEach(([k, v]) => player.finder.setTileCost(parseInt(k, 10) + 1, v.cost));

    let grid = [];
    for (let y = 0; y < TOWN_HEIGHT; y++) {
      let col = [];
      for (let x = 0; x < TOWN_WIDTH; x++) {
        col.push(scene.map.getTileAt(x, y, true, "Collision").index);
      }
      grid.push(col);
    }
    this.finder.setGrid(grid);

    this.camera = scene.cameras.main;
    this.camera.setBounds(
      0,
      0,
      TOWN_WIDTH * TILE_WIDTH * SCALE,
      TOWN_HEIGHT * TILE_HEIGHT * SCALE
    );
    this.camera.startFollow(this);

    this.position = position;

    this.sound = scene.sound;
    this.x = this.positionToPixels(this.position.x, TILE_WIDTH);
    this.y = this.positionToPixels(this.position.y, TILE_HEIGHT);
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
          this.x -= SCALE;
          break;
        case Directions.RIGHT:
          this.x += SCALE;
          break;
        case Directions.UP:
          this.y -= SCALE;
          break;
        case Directions.DOWN:
          this.y += SCALE;
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
        this.x = this.positionToPixels(this.position.x, TILE_WIDTH);
        this.y = this.positionToPixels(this.position.y, TILE_HEIGHT);

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
    return Math.abs(this.positionToPixels(this.position.x, TILE_WIDTH)  - x) < SCALE &&
           Math.abs(this.positionToPixels(this.position.y, TILE_HEIGHT) - y) < SCALE;
  }

  positionToPixels(coord, tileSize) {
    return coord * SCALE * tileSize;
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
    if (!this.scene.checkCollision(pointerTileX, pointerTileY)) {
      this.scene.destination.x = this.scene.map.tileToWorldX(pointerTileX);
      this.scene.destination.y = this.scene.map.tileToWorldY(pointerTileY);
      this.scene.destination.setVisible(true);

      console.log("going from (" + fromX + "," + fromY + ") to (" + toX + "," + toY + ")");
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
}

export default Player;
