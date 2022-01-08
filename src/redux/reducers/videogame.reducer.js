import { VIDEOGAME_INIT, PLAYER_ACTION, PLAYER_IDLE } from "../actions";

export default (state = { actions: [] }, { type, payload }) => {
  switch (type) {
    case PLAYER_ACTION:
      return {
        ...state,
        actions: [...state.actions, payload],
      };
    case PLAYER_IDLE:
      return {
        ...state,
        actions: [],
      };

    case VIDEOGAME_INIT:
      return {
        ...state,
        ...payload,
      };

    default:
      return state;
  }
};
