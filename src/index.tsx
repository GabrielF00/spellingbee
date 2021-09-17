import React from 'react';
import ReactDOM from 'react-dom';
import {HexGrid} from "./hex";

ReactDOM.render(
  <React.StrictMode>
      <HexGrid letters="ecpoml" centerLetter="t"/>
    {/*<Game />*/}
  </React.StrictMode>,
  document.getElementById('root')
);
