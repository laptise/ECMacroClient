/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useState } from "react";
import * as Puppeteer from "puppeteer-core";
import { ipcRenderer } from "electron";
import { AppContext, configFileRequester } from "../Context";

export default function Setting() {
  const context = useContext(AppContext);
  const { pushConsole } = context;
  const [url, setUrl] = useState("");
  const { loginInfo, setting } = context;
  const [urlIsValid, setUrlIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [email, setEmail] = useState(loginInfo.email);
  const [password, setPassword] = useState(loginInfo.password);
  const [chromePath, setChromePath] = useState(setting.chromePath);
  const [headlessMode, setHeadlessMode] = useState(setting.headlessMode);
  const [screenshotPath, setScreenshotPath] = useState(
    setting.screenshotDirectory
  );
  const targetPageInputEvent = (e: React.FormEvent) => {
    const input = e.target as HTMLInputElement;
    const { value } = input;
    context.setting.targetUrl = value;
    setUrl(input.value);
    const regexp = new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
    );
    const isValid = regexp.test(value);
    setUrlIsValid(isValid);
  };
  const puppeteerConfirmPage = async () => {
    setIsChecking(true);
    pushConsole?.(`ページを確認します: ${url}`);
    const browser = await Puppeteer.launch({
      executablePath: `${chromePath}/Contents/MacOS/Google Chrome`,
      headless: headlessMode,
    });
    const page = await browser.newPage();
    await page.goto(url);
    const pageTitle = await page.title();
    pushConsole(`ページが表示されました: ${pageTitle}`);
    const newDate = new Date();
    const dateText = `${newDate.getHours()}${newDate.getMinutes()}${newDate.getSeconds()}`;
    await page.screenshot({
      path: `./screenshots/${dateText}.png`,
    });
    pushConsole(`スクリーンショットを保存しました: ${dateText}.png`);
    await browser.close();
    if (
      window.confirm(
        `このページで正しいですか？\nOKボタンを押すとURLがセットされます。\nページタイトル:\n${pageTitle}`
      )
    ) {
      context.setting.targetUrl = url;
      setUrl(url);
    } else {
      context.setting.targetUrl = "";
    }
    setIsChecking(false);
    context.updateSetting();
  };
  const checkLogin = async () => {
    try {
      pushConsole("ログイン確認を開始します");
      const browser = await Puppeteer.launch({
        executablePath: `${chromePath}/Contents/MacOS/Google Chrome`,
        headless: headlessMode,
      });
      const page = await browser.newPage();
      await page.goto(context.loginPage);
      context.pushConsole(
        `ページが表示されました: ${context.loginPage}`,
        "info"
      );
      const loginForm = await page.$("form#loginForm");
      if (loginForm) {
        const loginInput = await loginForm.$("#loginInner_u");
        const passwordInput = await loginForm.$("input#loginInner_p");
        await loginInput?.type(context.loginInfo.email);
        await passwordInput?.type(context.loginInfo.password);
      }
      await page.click("input.loginButton");
      await page.waitForNavigation({ waitUntil: "networkidle0" });
      const resultTitle = await page.title();
      if (resultTitle.match("ログイン") || resultTitle.match("Login")) {
        await page.screenshot({
          path: `./screenshots/last-err.png`,
        });
        pushConsole("last-err.png - screeshotを保存しました。", "err");
        browser.close();
        throw new Error("ログインに失敗しました。");
      }
      pushConsole("success", "info");
    } catch (e) {
      pushConsole(e, "err");
    }
  };
  const confirmPage = () => {
    puppeteerConfirmPage();
  };
  const getAppPath = (event: any, arg: any) => {
    context.setting.chromePath = arg;
    setChromePath(arg);
    context.updateSetting();
  };
  const headlessModeCheck = (e: React.FormEvent) => {
    const checkbox = e.target as HTMLInputElement;
    context.setting.headlessMode = checkbox.checked;
    setHeadlessMode(checkbox.checked);
    context.updateSetting();
  };
  const getScreenshotPath = (event: any, arg: any) => {
    context.setting.screenshotDirectory = arg;
    setScreenshotPath(arg);
    context.updateSetting();
  };
  useEffect(() => {
    configFileRequester();
    setUrl(context.setting.targetUrl);
    setHeadlessMode(context.setting.headlessMode);
    setChromePath(context.setting.chromePath);
    ipcRenderer.on("app-path-reply", getAppPath);
    ipcRenderer.on("screenshot-path-reply", getScreenshotPath);
    return () => {
      ipcRenderer.removeListener("app-path-reply", getAppPath);
      ipcRenderer.removeListener("screenshot-path-reply", getScreenshotPath);
    };
  }, []);
  return (
    <div id="setting" className="single-window">
      <span className="box-title">Setting</span>
      <div className="content">
        <div
          className="section"
          style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}
        >
          <h3>Screenshotの保存先</h3>
          <input
            className={chromePath ? "" : "plaes-set-chrome"}
            onClick={() => ipcRenderer.send("get-screenshot-path")}
            onChange={() => true}
            readOnly={isChecking}
            style={{ cursor: "pointer" }}
            value={
              screenshotPath || "クリックして画像保存先をセットしてください"
            }
          />
        </div>
        <div
          className="section"
          style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}
        >
          <h3>Google Chromeのパス</h3>
          <input
            className={chromePath ? "" : "plaes-set-chrome"}
            onClick={() => ipcRenderer.send("get-app-path")}
            onChange={() => true}
            readOnly={isChecking}
            style={{ cursor: "pointer" }}
            value={
              chromePath || "クリックしてGoogle Chromeをセットしてください"
            }
          />
        </div>
        <div
          className="section"
          style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}
        >
          <h3>接続先サイト (Product page)</h3>
          <small style={{ marginBottom: 10 }}>
            URL入力後確認ボタンで確認する
          </small>
          <div className="input-button">
            <input
              readOnly={isChecking}
              spellCheck={false}
              onChange={targetPageInputEvent}
              value={url}
            />
            <button
              type="button"
              className={urlIsValid && chromePath ? "" : "is-disabled"}
              onClick={confirmPage}
              title="有効か確認"
            >
              確認
            </button>
          </div>
        </div>
        <div
          className="section"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h3>ログイン情報</h3>
          <div style={{ paddingLeft: 10 }}>
            <label className="form-label">
              <span className="label">Email</span>
              <input
                value={email}
                spellCheck={false}
                onChange={(e: React.FormEvent) => {
                  const input = e.target as HTMLInputElement;
                  setEmail(input.value);
                  context.loginInfo.email = input.value;
                }}
              />
            </label>
            <label className="form-label">
              <span className="label">Password</span>
              <input
                type="password"
                value={password}
                spellCheck={false}
                onChange={(e: React.FormEvent) => {
                  const input = e.target as HTMLInputElement;
                  setPassword(input.value);
                  context.loginInfo.password = input.value;
                }}
              />
            </label>
            <div className="button-row">
              <button
                type="button"
                onClick={checkLogin}
                style={{ marginLeft: "auto" }}
              >
                ログイン確認
              </button>
            </div>
          </div>
        </div>
        <div
          className="section"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h3>Headless Mode</h3>
          <small>
            headlessモードでは実際のブラウザが起動せずに実行されます。
            速度向上、PCのメモリーに有効ですが、サイトによってはJavaScriptの影響で正しく動作しない場合があります。
            <br />
            正しく動作しない場合、チェックを外してください。
          </small>
          <label
            style={{ marginTop: 10, marginLeft: "auto", fontWeight: "bold" }}
          >
            Headless モードで利用する
            <input
              style={{ marginLeft: 10 }}
              className="checkbox02"
              type="checkbox"
              checked={headlessMode}
              onChange={headlessModeCheck}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
