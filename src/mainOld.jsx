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
    {/* <div className="font-geistM">This is test</div> */}
    <App />
  </CookiesProvider>
  //</React.StrictMode>
);
