/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
import { ipcRenderer } from "electron";
import React, { useContext, useEffect, useState } from "react";
import fs from "fs";
import { AppContext, configFileRequester } from "../Context";
import { AppConfig } from "../../model";

export default function Screenshots() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const context = useContext(AppContext);
  const { setting } = context;
  const [appPath, setAppPath] = useState(setting.screenshotDirectory);
  const screenshotFolder = setting.screenshotDirectory;
  const [fileList, setFileList] = useState([] as string[]);
  const [fileInfoList, setFileInfoList] = useState([] as fs.Stats[]);
  const [dataIsSet, setDataIsSet] = useState(false);

  function getFileInfo() {
    setFileInfoList([]);
    const Array: fs.Stats[] = [];
    const push = (data: fs.Stats[]) => {
      setDataIsSet(false);
      data.sort((a, b) => a.birthtime.valueOf() - b.birthtime.valueOf());
      setFileInfoList(data);
      setDataIsSet(true);
    };
    fileList.forEach((file) => {
      fs.stat(`${screenshotFolder}/${file}`, (err, stat) => {
        if (err) throw err;
        const date = stat.birthtime as Date;
        Array.push(
          Object.assign(stat, {
            birth: `${date.getFullYear()}年${
              date.getMonth() + 1
            }月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
          })
        );
        if (Array.length === fileList.length) push(Array);
      });
    });
  }
  function getFileList() {
    try {
      fs.readdir(screenshotFolder, (err, files: string[]) => {
        if (err) throw err;
        setFileList(
          files.filter((file) => file.match(".png") || file.match(".PNG"))
        );
        console.log(fileList);
        if (fileList) getFileInfo();
      });
    } catch {
      window.alert("ファイルリスト取得に失敗しました。");
    }
  }

  function getFiles() {
    getFileList();
  }

  useEffect(() => {
    if (appPath) getFiles();
  }, [appPath]);
  useEffect(() => {
    ipcRenderer.on("get-config-file-reply", (_, arg: AppConfig) => {
      setAppPath(arg.appDir);
    });
    configFileRequester();
  });
  return (
    <div id="screenshots" className="single-window">
      <span className="box-title">View screenshot images</span>
      <div className="content" style={{ padding: 0 }}>
        <div className="files-overview-descriptions">{`保存済みのファイル : ${fileList.length}`}</div>
        <table className="file-list">
          <thead>
            <tr>
              <th style={{ width: 30 }}>No</th>
              <th>ファイル名</th>
              <th>追加日</th>
              <th>サイズ</th>
            </tr>
          </thead>
          <tbody>
            {dataIsSet &&
              fileList.map((file: string, index: number) => (
                <tr
                  key={index}
                  className="single-file"
                  onClick={() => {
                    ipcRenderer.send("view-img");
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{file}</td>
                  <td>{(fileInfoList[index] as any).birth}</td>
                  <td>
                    {Math.floor(
                      fileInfoList[index].size / 1000
                    ).toLocaleString()}
                    KB
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
