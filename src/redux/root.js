import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";
import { epics as trapEpics } from "./epics/traps.epic";
import { epics as playerEpics } from "./epics/player.epic";
import { epics as videogameEpics } from "./epics/videogame.epic";
import player from "./reducers/player.reducer";
import quests from "./reducers/quests.reducer";
import map from "./reducers/map.reducer";
import videogame from "./reducers/videogame.reducer";

export const rootEpic = combineEpics(
  ...trapEpics,
  ...playerEpics,
  ...videogameEpics
);

export const rootReducer = combineReducers({
  player,
  quests,
  map,
  videogame,
});
