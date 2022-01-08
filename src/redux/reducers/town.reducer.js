import { TOWN_INIT } from "../actions";

export default (state = {}, { type, payload }) => {
  switch (type) {
    case TOWN_INIT:
      return {
        ...state,
        ...payload,
      };

    default:
      return state;
  }
};
