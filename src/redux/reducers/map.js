import { Directions } from "../../constants/game.constants";

export const SET = "MAP SET";
export const set = (payload) => ({
  type: SET,
  payload: { instant: true, ...payload },
});

export default (
  state = {
    name: "city",
    position: { x: 13, y: 19 },
    direction: Directions.DOWN,
  },
  { type, payload }
) => {
  switch (type) {
    case SET:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
