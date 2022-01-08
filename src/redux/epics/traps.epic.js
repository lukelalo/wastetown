import { ofType } from "redux-observable";
import { filter, mapTo } from "rxjs/operators";
import * as actions from "../actions";

export const trapsEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.PLAYER_POSITION),
    filter((action) => action.payload.x === 16 && action.payload.y === 18),
    mapTo(actions.trap())
  );

export const epics = [trapsEpic];
