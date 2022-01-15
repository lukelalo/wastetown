export const SET = "BEHAVIOR SET";
export const set = (payload) => ({
  type: SET,
  payload,
});

export const NEXT = "BEHAVIOR NEXT";
export const next = (payload) => ({
  type: NEXT,
  payload,
});

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
