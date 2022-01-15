import { ofType } from "redux-observable";
import { filter, mapTo } from "rxjs/operators";
import * as actions from "../actions";
import * as player from "../reducers/player";

export const trapsEpic = (action$, state$) =>
  action$.pipe(
    ofType(player.POSITION),
    filter((action) => action.payload.x === 16 && action.payload.y === 18),
    mapTo(actions.trap())
  );

export const epics = [trapsEpic];
