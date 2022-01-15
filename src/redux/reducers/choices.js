import * as behavior from "./behavior";

export const SET = "CHOICES SET";
export const set = (payload) => ({
  type: SET,
  payload,
});

export default (state = [], { type, payload }) => {
  switch (type) {
    case behavior.SET:
      return [];

    case SET:
      return payload;

    default:
      return state;
  }
};
