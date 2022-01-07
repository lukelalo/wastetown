import { ofType } from "redux-observable";
import { filter, mapTo } from "rxjs/operators";

const PLAYER_POSITION = "PLAYER_POSITION";

export const trapsEpic = (action$, state$) =>
  action$.pipe(
    ofType(PLAYER_POSITION),
    filter((action) => action.payload.x === 16 && action.payload.y === 18),
    mapTo({ type: "ITS_A_TRAP" })
  );

export const epics = [trapsEpic];
