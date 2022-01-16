import * as behavior from "./behavior";

export const ADD = "INVENTORY ADD";
export const add = (payload) => ({ type: ADD, payload });

export const REMOVE = "INVENTORY REMOVE";
export const remove = (payload) => ({ type: REMOVE, payload });

export const SHOW = "INVENTORY SHOW";
export const show = () => ({ type: SHOW });

export const HIDE = "INVENTORY HIDE";
export const hide = () => ({ type: HIDE });

export default (state = { objects: [], visible: false }, { type, payload }) => {
  switch (type) {
    case behavior.SET:
    case HIDE:
      return {
        ...state,
        visible: false,
      };

    case ADD:
      return {
        ...state,
        objects: [...state.objects, payload],
      };

    case REMOVE:
      return {
        ...state,
        objects: state.objects.filter((o) => o.id !== payload.id),
      };

    case SHOW:
      return {
        ...state,
        visible: true,
      };

    default:
      return state;
  }
};
