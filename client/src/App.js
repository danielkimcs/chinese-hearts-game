import React, { useEffect } from 'react';
import './App.css';
import socketIOClient from "socket.io-client";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";

function App() {
  useEffect(() => {
    const socket = socketIOClient();
  }, []);

  return (
    <Router>
      <Routes />
    </Router>
  );
}

export default App;
