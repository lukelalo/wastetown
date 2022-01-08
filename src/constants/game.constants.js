export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 600;
export const SCALE = 2;
export const STEP = 1;
export const COLLISION = "Collision";
export const BACKGROUND = "Background";
export const BUILDINGS = "Buildings";
export const DETAILS = "Details";
export const TOP = "Top";

export const Directions = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

export const Status = {
  IDLE: "IDLE",
  TALKING: "TALKING",
  WALKING: "WALKING",
};

export const Animations = {
  [Status.WALKING]: {
    [Directions.UP]: "walkUp",
    [Directions.DOWN]: "walkDown",
    [Directions.LEFT]: "walkLeft",
    [Directions.RIGHT]: "walkRight",
  },
  [Status.IDLE]: {
    [Directions.UP]: "idleUp",
    [Directions.DOWN]: "idleDown",
    [Directions.LEFT]: "idleLeft",
    [Directions.RIGHT]: "idleRight",
  },
};
