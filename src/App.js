import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider, connect } from 'react-redux';

import { log } from './shared/logger';

import HomePage from './components/HomePage';
import NotFoundPage from './components/NotFoundPage';

import configureStore from './store/configureStore';

import './styles.css';
import 'antd/dist/antd.css';

// TAGS
const TAG_RootContainerFC = 'RootContainerFC_FC';
const TAG_App = 'App_FC';

// configure redux store
const store = configureStore();

// Main Container Component
function RootContainerFC() {
  log(TAG_RootContainerFC);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
}

let RootContainer = connect()(RootContainerFC);

// Main Component
function App() {
  log(TAG_App);

  return (
    <div className="App">
      <Provider store={store}>
        <RootContainer />
      </Provider>
    </div>
  );
}

export default App;
