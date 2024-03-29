import React from 'react'; import ReactDOM from 'react-dom'; import {HexGrid} from "./hex"; import {BrowserRouter} from "react-router-dom";
import ReactGA from 'react-ga';

ReactGA.initialize('UA-7508657-5', {
    gaOptions: {
        siteSpeedSampleRate: 100
    }
});
ReactGA.plugin.require('ipMeta', {
        serviceProvider: 'dimension1',
        networkDomain: 'dimension2',
        networkType: 'dimension3',
    });
ReactGA.ga('ipMeta:loadNetworkFields');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <HexGrid />
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
