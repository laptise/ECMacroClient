import { ipcRenderer } from "electron";
import React from "react";
import { AppConfig } from "../model";

export const configFileRequester = () => {
  console.log("requesting");
  ipcRenderer.send("get-config-file");
};

export type ConsoleErrorType = "err" | "info";

interface LoginInfo {
  email: string;
  password: string;
}

interface IAppContext {
  setting: AppConfig;
  pushConsole: (message: string, type?: ConsoleErrorType) => void;
  loginPage: string;
  loginInfo: LoginInfo;
  updateSetting: () => void;
}

export const appContext: IAppContext = {
  setting: {
    chromePath: "",
    targetUrl: "",
    screenshotDirectory: "",
    appDir: "",
    headlessMode: true,
  },
  loginPage: "https://grp01.id.rakuten.co.jp/rms/nid/logini",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pushConsole: null as any,
  loginInfo: {
    email: "",
    password: "",
  },
  updateSetting() {
    const stringfied = JSON.stringify(appContext);
    ipcRenderer.send("update-config", stringfied);
  },
};
export const AppContext = React.createContext(appContext);
