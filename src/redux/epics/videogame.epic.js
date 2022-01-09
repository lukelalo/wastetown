import { ofType } from "redux-observable";
import {
  switchMap,
  filter,
  mapTo,
  withLatestFrom,
  take,
  ignoreElements,
  startWith,
} from "rxjs/operators";
import { race, of } from "rxjs";
import * as actions from "../actions";

export const nextActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.VIDEOGAME_NEXT_ACTION),
    withLatestFrom(state$),
    filter(([action, { videogame }]) => videogame.actions.length === 0),
    mapTo(actions.playerIdle())
  );

export const epics = [nextActionEpic];
