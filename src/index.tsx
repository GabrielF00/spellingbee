import React from 'react';
import ReactDOM from 'react-dom';
import {HexGrid} from "./hex";
import {BrowserRouter} from "react-router-dom";
import ReactGA from 'react-ga';

ReactGA.initialize('UA-7508657-5');

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <HexGrid />
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
