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
    switchMap(([action, { videogame, map }]) =>
      iif(
        () => videogame.actions.length === 0,
        of(actions.playerIdle()),
        of({
          ...videogame.actions[0],
          payload: { ...(videogame.actions[0]?.payload || {}), map: map.name },
        })
      )
    )
  );

export const setActionsEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.VIDEOGAME_SET_ACTIONS),
    withLatestFrom(state$),
    map(([action, { videogame, map }]) => ({
      ...videogame.actions[0],
      payload: { ...(videogame.actions[0]?.payload || {}), map: map.name },
    }))
  );

export const changeSceneEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.CHANGE_SCENE),
    mapTo(actions.videogameNextAction())
  );

export const eventsDoneEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.EVENTS_DONE),
    mapTo(actions.videogameNextAction())
  );


  export const enableClickEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.VIDEOGAME_ENABLE_CLICK),
    mapTo(actions.videogameNextAction())
  );

  export const disableClickEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.VIDEOGAME_DISABLE_CLICK),
    mapTo(actions.videogameNextAction())
  );

export const playerActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.PLAYER_ACTION),
    mapTo(actions.videogameNextAction())
  );

export const movePlayerEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.MOVE_PLAYER),
    withLatestFrom(state$),
    // Switch to the last Interact action
    switchMap(([{ payload }, { player }]) =>
      iif(
        () =>
          payload.position.x === player.position.x &&
          payload.position.y === player.position.y,
        of(actions.videogameNextAction()),
        race(
          action$.pipe(
            ofType(actions.PLAYER_POSITION),
            filter(
              (action) =>
                action.payload.position.x === payload.position.x &&
                action.payload.position.y === payload.position.y
            ),
            mapTo(actions.videogameNextAction()),
            take(1)
          ),
          action$.pipe(
            ofType(actions.VIDEOGAME_SET_ACTIONS),
            take(1),
            ignoreElements()
          )
        )
      )
    )
  );

export const showTextEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.SHOW_TEXT),
    withLatestFrom(state$),
    // Switch to the last Interact action
    switchMap(([{ payload }, { videogame }]) =>
      iif(
        () => videogame.dialogs.length === 0,
        of(actions.videogameNextAction()),
        race(
          action$.pipe(
            ofType(actions.VIDEOGAME_NEXT_DIALOG),
            withLatestFrom(state$),
            filter(([action, { videogame }]) => videogame.dialogs.length === 0),
            mapTo(actions.videogameNextAction()),
            take(1)
          ),
          action$.pipe(
            ofType(actions.VIDEOGAME_SET_ACTIONS),
            take(1),
            ignoreElements()
          )
        )
      )
    )
  );

export const showChoicesEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.SHOW_CHOICES),
    withLatestFrom(state$),
    // Switch to the last Interact action
    switchMap(([{ payload }, { videogame }]) =>
      iif(
        () => videogame.choices.length === 0,
        of(actions.videogameNextAction()),
        race(
          action$.pipe(
            ofType(actions.VIDEOGAME_CLICK_CHOICE),
            withLatestFrom(state$),
            filter(([action, { videogame }]) => videogame.choices.length === 0),
            mapTo(actions.videogameNextAction()),
            take(1)
          ),
          action$.pipe(
            ofType(actions.VIDEOGAME_SET_ACTIONS),
            take(1),
            ignoreElements()
          )
        )
      )
    )
  );

export const epics = [
  enableClickEpic,
  disableClickEpic,
  nextActionEpic,
  setActionsEpic,
  playerActionEpic,
  eventsDoneEpic,
  changeSceneEpic,
  movePlayerEpic,
  showTextEpic,
  showChoicesEpic,
];
