import { ofType } from "redux-observable";
import { filter, mapTo, withLatestFrom } from "rxjs/operators";
import * as actions from "../actions";

export const stopEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.PLAYER_POSITION),
    withLatestFrom(state$),
    filter(
      ([action, { player }]) =>
        action.payload.x === player.path.slice(-1)[0].x &&
        action.payload.y === player.path.slice(-1)[0].y
    ),
    mapTo(actions.playerStop())
  );

export const stepEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.PLAYER_POSITION),
    withLatestFrom(state$),
    filter(
      ([action, { player }]) =>
        player.path.length > 1 &&
        action.payload.x === player.path[0].x &&
        action.payload.y === player.path[0].y
    ),
    mapTo(actions.playerStep())
  );

export const epics = [stopEpic, stepEpic];
