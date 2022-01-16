import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";
import { epics } from "./epics";
import behavior from "./reducers/behavior";
import choices from "./reducers/choices";
import dialogs from "./reducers/dialogs";
import events from "./reducers/events";
import inventory from "./reducers/inventory";
import player from "./reducers/player";
import map from "./reducers/map";
import videogame from "./reducers/videogame";

export const rootEpic = combineEpics(...epics);

export const rootReducer = combineReducers({
  behavior,
  choices,
  dialogs,
  events,
  inventory,
  map,
  player,
  videogame,
});
