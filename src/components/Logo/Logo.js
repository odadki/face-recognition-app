import React from "react";
import Tilt from "react-tilt";
import brain from "./brain.png";
import "./Logo.css";

const Logo = () => {
  return (
    <div className="center">
      <Tilt
        className="Tilt br2"
        options={{ max: 50 }}
        style={{ height: 150, width: 150 }}
      >
        <div className="Tilt-inner pa3">
          <img className="brain-image" src={brain} alt="logo" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
