/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Puppeteer from "puppeteer-core";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../Context";

class Task {
  name: string;

  action: (page: Puppeteer.Page) => Promise<any>;

  constructor(name: string, action: (page: Puppeteer.Page) => Promise<any>) {
    this.name = name;
    this.action = action;
  }
}

export default function Main() {
  const context = useContext(AppContext);

  const taskList = [
    new Task("Go login page", async (page: Puppeteer.Page) => {
      await page.goto(context.loginPage);
      context.pushConsole("ログインページが表示されました。", "info");
    }),
    // new Task(""),
  ];

  async function run() {
    const browser = await Puppeteer.launch({
      executablePath: `${context.setting.chromePath}/Contents/MacOS/Google Chrome`,
      headless: context.setting.headlessMode,
    });
    const page = await browser.newPage();
    await taskList[0].action(page);
    context.pushConsole(`ページが表示されました: ${context.loginPage}`, "info");
    const loginForm = await page.$("form#loginForm");
    if (loginForm) {
      const loginInput = await loginForm.$("#loginInner_u");
      const passwordInput = await loginForm.$("input#loginInner_p");
      await loginInput?.type(context.loginInfo.email);
      await passwordInput?.type(context.loginInfo.password);
    }
    await page.click("input.loginButton");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
  }

  function startApp() {
    run();
  }
  useEffect(() => startApp(), []);
  return (
    <div id="main" className="single-window">
      da
    </div>
  );
}
