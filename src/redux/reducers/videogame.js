import * as player from "./player";

// Videogame actions
export const ENABLE_CLICK = "VIDEOGAME ENABLE CLICK";
export const videogameEnableClick = (payload) => ({
  type: ENABLE_CLICK,
  payload: { instant: true, ...payload },
});

export const DISABLE_CLICK = "VIDEOGAME DISABLE CLICK";
export const videogameDisableClick = (payload) => ({
  type: DISABLE_CLICK,
  payload: { instant: true, ...payload },
});

export default (state = { clicks: true }, { type, payload }) => {
  switch (type) {
    case ENABLE_CLICK:
    case player.IDLE:
      return {
        ...state,
        clicks: true,
      };

    case DISABLE_CLICK:
      return {
        ...state,
        clicks: false,
      };

    default:
      return state;
  }
};
