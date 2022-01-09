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
import { race, of, iif } from "rxjs";
import * as actions from "../actions";
import { Status } from "../../constants/game.constants";

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

export const interactEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.PLAYER_INTERACT),
    withLatestFrom(state$),
    // Only interact if player is avaiable
    filter(
      ([action, { player }]) =>
        player.status === Status.IDLE || player.status === Status.WALKING
    ),
    // Switch to the last Interact action
    switchMap(([{ payload }, { player }]) => {
      return iif(
        () => payload.path.length === 0,
        // if player is at position, emit action immediately
        of(actions.playerAction(payload)),
        // if not, race for player at position or new path given
        race(
          action$.pipe(
            ofType(actions.PLAYER_POSITION),
            filter(
              (action) =>
                payload.path.length === 0 ||
                (action.payload.x === payload.path.slice(-1)[0].x &&
                  action.payload.y === payload.path.slice(-1)[0].y)
            ),
            mapTo(actions.playerAction(payload)),
            take(1)
          ),
          // take 2 PLAYER PATH because this epic emits one
          action$.pipe(ofType(actions.PLAYER_PATH), take(2), ignoreElements())
        ).pipe(startWith(actions.playerPath(payload)))
      );
    })
  );

export const epics = [interactEpic /*stopEpic , stepEpic*/];
