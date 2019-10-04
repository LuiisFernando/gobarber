import React from "react";
import { Provider } from "react-redux";
import "./config/ReactotronConfig";

import { Router } from "react-router-dom";
import history from "./services/history";

import Routes from "./routes";

import store from "./store";

import GlobalStyles from "./styles/global";

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Routes />
        <GlobalStyles />
      </Router>
    </Provider>
  );
}

export default App;
