import React, { useContext, useEffect, useState } from "react";
import { AppContext, configFileRequester } from "../Context";

interface ToolProps {
  name: string;
  description: string;
  dragState: [JSX.Element, React.Dispatch<React.SetStateAction<JSX.Element>>];
  // eslint-disable-next-line react/no-unused-prop-types
  toolClass: ToolClass;
}
function Tool({ name, description, dragState }: ToolProps) {
  const dragStart = (e: React.DragEvent<HTMLSpanElement>) => {
    console.log(e);
    console.log(dragState);
  };
  return (
    <div draggable onDragStart={dragStart} className="single-tool">
      <span className="title">{name}</span>
      <span className="description">{description}</span>
    </div>
  );
}

class ToolClass {
  id: number;

  name: string;

  description: string;

  constructor(id: number, name: string, descrption: string) {
    this.id = id;
    this.name = name;
    this.description = descrption;
  }
}
const toollist = [
  new ToolClass(0, "Start at", "起動"),
  new ToolClass(1, "Wait until", "指定時間までまつ"),
];

export default function Main() {
  const context = useContext(AppContext);
  const { updateSetting } = context;
  const [dragging, setDragging] = useState((null as unknown) as JSX.Element);
  useEffect(() => {
    configFileRequester();
  }, []);

  const dragEnter = (e: React.DragEvent<HTMLSpanElement>) => {
    console.log(e.target);
  };
  return (
    <div id="main" className="single-window">
      <span
        aria-hidden
        tabIndex={0}
        role="button"
        onClick={updateSetting}
        className="box-title"
      >
        Main
      </span>
      <div style={{ padding: 10 }}>
        <div className="tool-box" style={{ marginBottom: 10 }}>
          {toollist.map((tool) => (
            <Tool
              key={tool.id}
              toolClass={tool}
              name={tool.name}
              description={tool.description}
              dragState={[dragging, setDragging]}
            />
          ))}
        </div>
        <div onDragEnter={dragEnter} className="flow-setter" />
      </div>
    </div>
  );
}
