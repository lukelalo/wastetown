import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";
import { epics as trapEpics } from "./epics/traps.epic";
import { epics as playerEpics } from "./epics/player.epic";
import player from "./reducers/player.reducer";

export const rootEpic = combineEpics(...trapEpics, ...playerEpics);

function lastAction(state = null, action) {
  return action;
}

export const rootReducer = combineReducers({ player, lastAction });
