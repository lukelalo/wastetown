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
import * as behavior from "./reducers/behavior";
import * as dialogs from "./reducers/dialogs";
import * as player from "./reducers/player";

export const behaviorNextEpic = (action$, state$) =>
  action$.pipe(
    ofType(behavior.NEXT),
    withLatestFrom(state$),
    switchMap(([action, { behavior, map }]) =>
      iif(
        () => behavior.length === 0,
        of(player.idle()),
        of({
          ...behavior[0],
          map: map.name,
        })
      )
    )
  );

export const behaviorSetEpic = (action$, state$) =>
  action$.pipe(
    ofType(behavior.SET),
    withLatestFrom(state$),
    map(([action, { behavior, map }]) => ({
      ...behavior[0],
      map: map.name,
    }))
  );

export const instantEventEpic = (action$, state$) =>
  action$.pipe(
    filter(({ payload }) => payload?.instant),
    mapTo(behavior.next())
  );

export const movePlayerEpic = (action$, state$) =>
  action$.pipe(
    ofType(player.MOVE),
    withLatestFrom(state$),
    // Switch to the last Interact action
    switchMap(([{ payload }, state]) =>
      iif(
        () =>
          payload.position.x === state.player.position.x &&
          payload.position.y === state.player.position.y,
        of(behavior.next()),
        race(
          action$.pipe(
            ofType(player.POSITION),
            filter(
              (action) =>
                action.payload.position.x === payload.position.x &&
                action.payload.position.y === payload.position.y
            ),
            mapTo(behavior.next()),
            take(1)
          ),
          action$.pipe(ofType(behavior.SET), take(1), ignoreElements())
        )
      )
    )
  );

export const dialogsSetEpic = (action$, state$) =>
  action$.pipe(
    ofType(dialogs.SET),
    withLatestFrom(state$),
    // Switch to the last Interact action
    switchMap(([{ payload }, state]) =>
      iif(
        () => state.dialogs.length === 0,
        of(behavior.next()),
        race(
          action$.pipe(
            ofType(dialogs.NEXT),
            withLatestFrom(state$),
            filter(([action, state]) => state.dialogs.length === 0),
            mapTo(behavior.next()),
            take(1)
          ),
          action$.pipe(ofType(behavior.SET), take(1), ignoreElements())
        )
      )
    )
  );

export const epics = [
  instantEventEpic,
  movePlayerEpic,
  behaviorNextEpic,
  behaviorSetEpic,
  dialogsSetEpic,
];
