import React, { useContext, useEffect, useRef } from "react";
import { AppContext, ConsoleErrorType } from "../Context";

export default function Console() {
  const context = useContext(AppContext);
  const consoleBox = useRef((null as unknown) as HTMLDivElement);
  useEffect(() => {
    const buildMessage = (message: string) => {
      const newDate = new Date();
      const dateText = `${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}:${newDate.getMilliseconds()}`;
      return `[${dateText}] ${message}\n`;
    };
    context.pushConsole = (message: string, type?: ConsoleErrorType) => {
      const messageSpan = document.createElement("span");
      messageSpan.innerText = buildMessage(message);
      messageSpan.className = type || "";
      consoleBox.current.append(messageSpan);
      consoleBox.current.scrollTop = consoleBox.current.scrollHeight;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div id="console">
      <span className="box-title">console</span>
      <div id="message-box" ref={consoleBox} />
    </div>
  );
}
