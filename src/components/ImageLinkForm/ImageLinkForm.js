import React from "react";
import Logo from "../Logo/Logo";

import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
<<<<<<< Updated upstream
      <h1 className="title">{"This Magic Brain"}</h1>
=======
      <h1 className="title">{"SmartBrain"}</h1>
>>>>>>> Stashed changes
      <Logo />
      <h3 className="caption">
        Enter an image url with face(s), and magic brain will detect them
      </h3>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-70 center"
            type="text"
            onChange={onInputChange}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
