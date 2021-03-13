import React from "react";
import { Link } from "react-router-dom";

export default function SideMenu() {
  return (
    <div id="side-menu">
      <span className="menu-title">Menu</span>
      <Link to="/">
        <button type="button" draggable={false}>
          Main Menu
        </button>
      </Link>
      <Link to="/Screenshots">
        <button type="button">Screenshot Images</button>
      </Link>
      <Link to="/Setting">
        <button type="button">Setting</button>
      </Link>
    </div>
  );
}
