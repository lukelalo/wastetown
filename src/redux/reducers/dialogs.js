export const NEXT = "DIALOGS NEXT";
export const next = (payload) => ({ type: NEXT, payload });

export const SET = "DIALOGS SET";
export const set = (payload) => ({ payload });


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
