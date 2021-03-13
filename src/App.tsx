import React from "react";
import { ipcRenderer } from "electron";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AppContext, appContext } from "./Context";
import Screenshots from "./components/Screenshots";
import Main from "./components/Main";
import WorkFlow from "./components/WorkFlow";
import Console from "./components/Console";
import Setting from "./components/Setting";
import SideMenu from "./components/SideMenu";
import "./App.global.scss";

ipcRenderer.on("get-config-file-reply", (_, arg) => {
  console.log(appContext);
  console.log(arg);
  Object.assign(appContext, arg);
});

ipcRenderer.on("update-config", (event, arg) => {
  console.log(event);
  console.log(arg);
  console.log("success");
});

export default function App() {
  return (
    <Router>
      ≥
      <SideMenu />
      <div id="main-window">
        <AppContext.Provider value={appContext}>
          <Switch>
            <Route path="/Setting" component={Setting} />
            <Route path="/Screenshots" component={Screenshots} />
            <Route path="/" component={Main} />
          </Switch>
          <Console />
        </AppContext.Provider>
      </div>
      <WorkFlow />
    </Router>
  );
}
