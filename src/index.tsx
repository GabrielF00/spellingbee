import React from 'react';
import ReactDOM from 'react-dom';
import {HexGrid} from "./hex";
import {BrowserRouter} from "react-router-dom";
import ReactGA from 'react-ga';

ReactGA.initialize('G-BBELFC1QH8');

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <HexGrid />
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
