import { createStore } from 'redux';
// import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';
import rootReducer from './reducers';

export default () => {
  /* create redux store and persist it in memory */
  // const store = createStore(rootReducer);

  /* create redux store and view it in Redux Dev Tools */
  /* const store = createStore(
        rootReducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ); */

  /* create redux store and persist it in localStorage */
  // load state from localStorage
  const persistedState = localStorage.getItem('reduxState')
    ? JSON.parse(localStorage.getItem('reduxState'))
    : {};

  const store = createStore(
    rootReducer,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  // save state to localStorage
  store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
  });

  return store;
};

/*
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {

    // create redux store using thunk
    const store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(thunk))
    );
    return store;
}
*/
