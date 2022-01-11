import { ofType } from "redux-observable";
import {
  switchMap,
  filter,
  map,
  mapTo,
  withLatestFrom,
  take,
  ignoreElements,
} from "rxjs/operators";
import { race, of, iif } from "rxjs";
import * as actions from "../actions";

export const nextActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.VIDEOGAME_NEXT_ACTION),
    withLatestFrom(state$),
    switchMap(([action, { videogame }]) =>
      iif(
        () => videogame.actions.length === 0,
        of(actions.playerIdle()),
        of(videogame.actions[0])
      )
    )
  );

export const setActionsEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.VIDEOGAME_SET_ACTIONS),
    withLatestFrom(state$),
    map(([action, { videogame }]) => videogame.actions[0])
  );

export const movePlayerEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.MOVE_PLAYER),
    withLatestFrom(state$),
    // Switch to the last Interact action
    switchMap(([{ payload }, { player }]) =>
      race(
        action$.pipe(
          ofType(actions.PLAYER_POSITION),
          filter(
            (action) =>
              action.payload.x === payload.position.x &&
              action.payload.y === payload.position.y
          ),
          mapTo(actions.videogameNextAction()),
          take(1)
        ),
        action$.pipe(ofType(actions.MOVE_PLAYER), take(1), ignoreElements()),
        action$.pipe(
          ofType(actions.VIDEOGAME_SET_ACTIONS),
          take(1),
          ignoreElements()
        )
      )
    )
  );

export const epics = [nextActionEpic, setActionsEpic, movePlayerEpic];
