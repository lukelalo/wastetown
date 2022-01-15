import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";
import { epics as trapEpics } from "./epics/traps.epic";
import { epics as playerEpics } from "./epics/player.epic";
import { epics as videogameEpics } from "./epics/videogame.epic";
import behavior from "./reducers/behavior";
import choices from "./reducers/choices";
import dialogs from "./reducers/dialogs";
import player from "./reducers/player";
import events from "./reducers/events";
import map from "./reducers/map";
import videogame from "./reducers/videogame";

export const rootEpic = combineEpics(
  ...trapEpics,
  ...playerEpics,
  ...videogameEpics
);

export const rootReducer = combineReducers({
  behavior,
  choices,
  dialogs,
  player,
  events,
  map,
  videogame,
});
