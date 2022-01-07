import Phaser from "phaser";
import { createStore, applyMiddleware } from "redux";
import { rootReducer, rootEpic } from "../redux/root";
import { createEpicMiddleware } from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension";
import { ajax } from "rxjs/ajax";

export default class Game extends Phaser.Game {
  constructor(config) {
    super(config);
    const epicMiddleware = createEpicMiddleware({ dependencies: { ajax } });
    this.store = createStore(
      rootReducer,
      composeWithDevTools(applyMiddleware(epicMiddleware))
    );

    epicMiddleware.run(rootEpic);
  }
}
