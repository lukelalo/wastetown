export const ADD = "INVENTARY ADD";
export const add = (payload) => ({ type: ADD, payload });

export const REMOVE = "INVENTARY REMOVE";
export const remove = (payload) => ({ payload });

export const SHOW = "INVENTARY SHOW";
export const add = (payload) => ({ type: SHOW, payload });

export const HIDE = "INVENTARY HIDE";
export const hide = (payload) => ({ payload });

export default (state = [], { type, payload }) => {
  switch (type) {

    case NEXT:
      return state.slice(1);

    case SET:
      return payload;

    default:
      return state;
  }
};
