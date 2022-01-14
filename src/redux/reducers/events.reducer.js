import { EVENTS_INIT, EVENTS_DONE } from "../actions";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case EVENTS_INIT:
      return {
        ...payload,
        ...state
      }

    case EVENTS_DONE:
      return {
        ...state,
        [payload.map]: state[payload.map].map(e => e.id === payload.id ? {...e, done: true} : e)
      }
    default:
      return state;
  }
};
