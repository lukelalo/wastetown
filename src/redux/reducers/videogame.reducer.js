import { PLAYER_ACTION, PLAYER_IDLE, VIDEOGAME_NEXT_ACTION } from "../actions";

export default (state = { actions: [] }, { type, payload }) => {
  switch (type) {
    case PLAYER_ACTION:
      return {
        ...state,
        actions: [...state.actions, ...payload.script],
      };
    case PLAYER_IDLE:
      return {
        ...state,
        actions: [],
      };

    case VIDEOGAME_NEXT_ACTION:
      return {
        ...state,
        actions: state.actions.slice(1),
      };

    default:
      return state;
  }
};
