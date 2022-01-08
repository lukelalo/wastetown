import {
  PLAYER_ACTION,
  PLAYER_INIT,
  PLAYER_PATH,
  PLAYER_POSITION,
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

export default (state = {}, { type, payload }) => {
  switch (type) {
    case PLAYER_ACTION:
      return {
        ...state,
        ...payload,
        isActing: true,
      };

    case PLAYER_INIT:
      return {
        ...state,
        ...payload,
        isActing: false,
        isAlive: true,
        direction: Directions.DOWN,
        path: [payload.position],
        status: Status.IDLE,
      };

    case PLAYER_PATH:
      return {
        ...state,
        ...payload,
        direction: _getDirection(
          payload.path[0],
          state.position,
          state.direction
        ),
        status: Status.WALKING,
      };

    case PLAYER_POSITION:
      return {
        ...state,
        direction: _getDirection(
          state.path.slice(1)[0],
          payload,
          state.direction
        ),
        position: payload,
        path: state.path.slice(1),
        status: state.path.length > 1 ? Status.WALKING : Status.IDLE,
      };

    default:
      return state;
  }
};
