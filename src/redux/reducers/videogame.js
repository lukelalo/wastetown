import {
  VIDEOGAME_DISABLE_CLICK,
  VIDEOGAME_ENABLE_CLICK,
} from "../actions";

import * as player from './player';

export default (state = { clicks: true }, { type, payload }) => {
  switch (type) {
    case player.IDLE:
      return {
        ...state,
        clicks: true,
      };

    case VIDEOGAME_DISABLE_CLICK:
      return {
        ...state,
        clicks: false,
      };

    default:
      return state;
  }
};
