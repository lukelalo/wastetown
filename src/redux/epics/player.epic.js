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
import { Directions } from "../../constants/game.constants";

// export const stopEpic = (action$, state$) =>
//   action$.pipe(
//     ofType(actions.PLAYER_POSITION),
//     withLatestFrom(state$),
//     filter(
//       ([action, { player }]) =>
//         action.payload.x === player.path.slice(-1)[0].x &&
//         action.payload.y === player.path.slice(-1)[0].y
//     ),
//     mapTo(actions.playerStop())
//   );

// export const stepEpic = (action$, state$) =>
//   action$.pipe(
//     ofType(actions.PLAYER_POSITION),
//     withLatestFrom(state$),
//     filter(
//       ([action, { player }]) =>
//         player.path.length > 1 &&
//         action.payload.x === player.path[0].x &&
//         action.payload.y === player.path[0].y
//     ),
//     mapTo(actions.playerStep())
//   );

export const interactEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.PLAYER_INTERACT),
    withLatestFrom(state$),
    switchMap(([{ payload }, { player }]) => {
      return race(
        action$.pipe(
          ofType(actions.PLAYER_POSITION),
          filter(
            (action) =>
              action.payload.x === payload.path.slice(-1)[0].x &&
              action.payload.y === payload.path.slice(-1)[0].y
          ),
          mapTo(actions.playerAction({ direction: Directions.UP }))
        ),
        action$.pipe(ofType(actions.PLAYER_PATH), take(2), ignoreElements())
      ).pipe(startWith(actions.playerPath(payload)));
    })
  );

export const epics = [interactEpic /*stopEpic , stepEpic*/];
