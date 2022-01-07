import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";
import { epics as trapEpics } from "../redux/traps.epic";

export const rootEpic = combineEpics(...trapEpics);

function lastAction(state = null, action) {
  return action;
}

export const rootReducer = combineReducers({ lastAction });
