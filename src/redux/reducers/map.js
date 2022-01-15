import { CHANGE_SCENE } from "../actions";
import { Directions } from "../../constants/game.constants";

export default (
  state = {
    name: "city",
    position: { x: 13, y: 19 },
    direction: Directions.DOWN,
  },
  { type, payload }
) => {
  switch (type) {
    case CHANGE_SCENE:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
