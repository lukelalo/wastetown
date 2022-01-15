import { Directions, Status } from "../../constants/game.constants";

import * as choices from "./choices";
import * as dialogs from "./dialogs";

// Player actions
export const ACTION = "PLAYER ACTION";
export const action = (payload) => ({ type: ACTION, payload });

export const IDLE = "PLAYER IDLE";
export const idle = () => ({ type: IDLE });

export const INIT = "PLAYER INIT";
export const init = (payload) => ({ type: INIT, payload });

export const PATH = "PLAYER PATH";
export const path = (payload) => ({ type: PATH, payload });

export const POSITION = "PLAYER POSITION";
export const position = (payload) => ({ type: POSITION, payload });

export const MOVE = "PLAYER MOVE";
export const move = (payload) => ({ type: MOVE, payload });

const _getDirection = (step, position, direction) => {
  return !step
    ? direction
    : step.x > position.x
    ? Directions.RIGHT
    : step.x < position.x
    ? Directions.LEFT
    : step.y > position.y
    ? Directions.DOWN
    : Directions.UP;
};

export default (
  state = { status: Status.IDLE, destination: {}, direction: Directions.UP },
  { type, payload }
) => {
  switch (type) {
    case ACTION:
      return {
        ...state,
        direction: payload.direction || state.direction,
        status: Status.ACTING,
      };

    case INIT:
      return {
        ...state,
        ...payload,
        isAlive: true,
        direction: [payload.direction],
        path: [],
        status: Status.IDLE,
      };

    case IDLE:
      return {
        ...state,
        destination: {},
        status: Status.IDLE,
        path: [],
      };

    case MOVE: {
      const atDestination =
        payload.position.x === state.position.x &&
        payload.position.y === state.position.y;

      return {
        ...state,
        destination: atDestination ? {} : payload,
        path: state.path.slice(0, 1),
      };
    }

    case dialogs.SET:
    case choices.SET:
      return {
        ...state,
        status: Status.ACTING,
      };

    case PATH:
      return state.status !== Status.IDLE && state.status !== Status.WALKING
        ? state
        : {
            ...state,
            direction: _getDirection(
              payload.path[0],
              state.position,
              state.direction
            ),
            path: payload.path,
            status: payload.path.length > 0 ? Status.WALKING : Status.IDLE,
          };

    case POSITION: {
      const atDestination =
        !state.destination.position ||
        (state.destination.position.x === payload.position.x &&
          state.destination.position.y === payload.position.y);
      return {
        ...state,
        destination: atDestination ? {} : state.destination,
        direction: atDestination
          ? state.destination.direction || state.direction
          : _getDirection(state.path[1], payload.position, state.direction),
        path: state.path.slice(1),
        position: payload.position,
        status: atDestination ? Status.IDLE : Status.WALKING,
      };
    }

    default:
      return state;
  }
};
