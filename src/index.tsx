import React from 'react';
import ReactDOM from 'react-dom';
import {HexGrid} from "./hex";
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <HexGrid />
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
