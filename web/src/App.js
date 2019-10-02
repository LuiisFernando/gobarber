import React from "react";

import "./config/ReactotronConfig";

import { Router } from "react-router-dom";
import history from "./services/history";

import Routes from "./routes";

function App() {
  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
}

export default App;
