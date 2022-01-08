import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";
import { epics as trapEpics } from "./epics/traps.epic";
import { epics as playerEpics } from "./epics/player.epic";
import player from "./reducers/player.reducer";
import town from "./reducers/town.reducer";
import videogame from "./reducers/videogame.reducer";

export const rootEpic = combineEpics(...trapEpics, ...playerEpics);

export const rootReducer = combineReducers({
  player,
  town,
  videogame,
});
