import { compose, applyMiddleware, createStore } from "redux";
import { watchUsers } from "./sagas";
import appReducer from "./reducers";
const sagaMiddleware = window.ReduxSaga.default();

const store = createStore(
  appReducer,
  compose(
    applyMiddleware(sagaMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f
  )
);

sagaMiddleware.run(watchUsers, { store });

window.store = store;
export default store;
