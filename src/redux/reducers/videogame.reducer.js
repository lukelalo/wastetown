import {
  PLAYER_ACTION,
  PLAYER_IDLE,
  SHOW_TEXT,
  VIDEOGAME_NEXT_ACTION,
  VIDEOGAME_NEXT_DIALOG,
  VIDEOGAME_SET_ACTIONS,
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

    case SHOW_TEXT:
      return {
        ...state,
        dialogs: payload.text,
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

    case VIDEOGAME_SET_ACTIONS:
      return {
        ...state,
        actions: payload,
      };

    default:
      return state;
  }
};
