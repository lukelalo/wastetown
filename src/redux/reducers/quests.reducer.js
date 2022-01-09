import { QUEST_DONE } from "../actions";
import townQuests from "../../quests/town.quests";

export default (state = [...townQuests], { type, payload }) => {
  switch (type) {
    case QUEST_DONE:
      return state.map((quest) =>
        quest.id === payload.id ? { ...quest, done: true } : quest
      );
    default:
      return state;
  }
};
