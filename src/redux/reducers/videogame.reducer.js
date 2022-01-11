import {
  PLAYER_ACTION,
  PLAYER_IDLE,
  VIDEOGAME_NEXT_ACTION,
  VIDEOGAME_NEXT_DIALOG,
} from "../actions";

export default (state = { actions: [], dialogs: [] }, { type, payload }) => {
  switch (type) {
    // case PLAYER_ACTION:
    //   return {
    //     ...state,
    //     actions: [...state.actions, ...payload.script],
    //   };
    // case PLAYER_IDLE:
    //   return {
    //     ...state,
    //     actions: [],
    //   };

    case VIDEOGAME_NEXT_ACTION:
      return {
        ...state,
        actions: state.actions.slice(1),
      };

    case VIDEOGAME_NEXT_ACTION:
      return {
        ...state,
        actions: state.actions.slice(1),
      };

    case VIDEOGAME_NEXT_DIALOG:
      return {
        ...state,
        dialogs: state.dialogs.slice(1),
      };

    default:
      return state;
  }
};
