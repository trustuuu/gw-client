import React from "react";
import ReactDOM from "react-dom/client";
import "./css/style.css";

import App from "./App";
import { CookiesProvider } from "react-cookie";
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  //<React.StrictMode>
  <CookiesProvider>
    <App />
  </CookiesProvider>
  //</React.StrictMode>
);
