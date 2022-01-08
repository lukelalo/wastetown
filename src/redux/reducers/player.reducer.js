import {
  PLAYER_INIT,
  PLAYER_MOVE,
  PLAYER_POSITION,
  PLAYER_STOP,
  PLAYER_STEP,
} from "../actions";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case PLAYER_INIT:
      return {
        ...state,
        isMoving: false,
        isActing: false,
        isAlive: true,
        path: [payload.position],
        ...payload,
      };

    case PLAYER_MOVE:
      return { ...state, isMoving: true, ...payload };

    case PLAYER_POSITION:
      return { ...state, position: payload };

    case PLAYER_STOP: {
      return { ...state, isMoving: false, path: [] };
    }

    case PLAYER_STEP: {
      return { ...state, path: state.path.slice(1) };
    }

    default:
      return state;
  }
};
