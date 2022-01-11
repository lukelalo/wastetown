import {
  MOVE_PLAYER,
  PLAYER_ACTION,
  PLAYER_IDLE,
  PLAYER_INIT,
  PLAYER_PATH,
  PLAYER_POSITION,
  SHOW_TEXT,
} from "../actions";
import { Directions, Status } from "../../constants/game.constants";

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
    case PLAYER_ACTION:
      return {
        ...state,
        direction: payload.direction || state.direction,
        status: Status.ACTING,
      };

    case PLAYER_INIT:
      return {
        ...state,
        ...payload,
        isAlive: true,
        direction: [payload.direction],
        path: [],
        status: Status.IDLE,
      };

    case PLAYER_IDLE:
      return {
        ...state,
        destination: {},
        status: Status.IDLE,
        path: [],
      };

    case MOVE_PLAYER: {
      const atDestination =
        payload.position.x === state.position.x &&
        payload.position.y === state.position.y;

      return {
        ...state,
        destination: atDestination ? {} : payload,
        path: state.path.slice(0, 1)
      };
    }

    case SHOW_TEXT:
      return {
        ...state,
        status: Status.ACTING,
      };

    case PLAYER_PATH:
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

    case PLAYER_POSITION: {
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
