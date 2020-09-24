import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import logo from "../logo.svg";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Other Page Component</p>
        <Link to="/">
          <Button variant="contained" color="primary">
            Go Home!
          </Button>
        </Link>
      </header>
    </div>
  );
}

export default App;
