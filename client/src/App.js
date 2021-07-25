import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";

import ReactGA from 'react-ga';
ReactGA.initialize('UA-88938949-4');

function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  });
  return (
    <Router>
      <div className="main-div">
        <Routes />
      </div>
    </Router>
  );
}

export default App;
