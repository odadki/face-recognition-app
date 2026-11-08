import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({
  imageUrl,
  boxes,
  requestId,
  onImageLoad,
  onImageError,
}) => {
  if (!imageUrl) return null;
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          // A new key per Detect click reloads the image, even for the same URL.
          key={requestId}
          id="inputimage"
          alt=""
          src={imageUrl}
          // Needed so the browser lets us read the pixels of images from other sites.
          crossOrigin="anonymous"
          width="500px"
          height="auto"
          onLoad={(event) => onImageLoad(event, requestId)}
          onError={() => onImageError(requestId)}
        />
        {boxes.map((box, i) => (
          <div
            key={i}
            className="bounding-box"
            style={{
              top: box.topRow,
              right: box.rightCol,
              bottom: box.bottomRow,
              left: box.leftCol,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
