import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";

export const rootEpic = combineEpics(...[]);

function lastAction(state = null, action) {
  return action;
}

export const rootReducer = combineReducers({ lastAction });
