import React, { Component } from "react";
// import SignIn from "./components/SignIn/SignIn";
// import Register from "./components/Register/Register";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
// import Navigation from "./components/Navigation/Navigation";
// import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
// import Rank from "./components/Rank/Rank";
import { detectFaces } from "./faceDetector";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      boxes: [],
      status: "idle", // idle | loading | done | error
      message: "",
      requestId: 0,
      route: "signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      },
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  // Converts MediaPipe detections (pixels in the image's natural size) into
  // the inset offsets used by .bounding-box, as percentages so the boxes stay
  // aligned however large the image is displayed.
  calculateFaceLocation = (result, image) => {
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const pct = (value, total) => `${(value / total) * 100}%`;
    return result.detections.map(({ boundingBox }) => {
      const { originX, originY, width: w, height: h } = boundingBox;
      const right = Math.min(originX + w, width);
      const bottom = Math.min(originY + h, height);
      return {
        leftCol: pct(Math.max(originX, 0), width),
        topRow: pct(Math.max(originY, 0), height),
        rightCol: pct(width - right, width),
        bottomRow: pct(height - bottom, height),
      };
    });
  };

  displayFaceBox = (boxes) => {
    const count = boxes.length;
    this.setState({
      boxes,
      status: "done",
      message:
        count === 0
          ? "No faces found in this image. Try a photo where faces are clear and facing the camera."
          : `Found ${count} face${count === 1 ? "" : "s"}.`,
    });
  };

  showError = (message) => {
    this.setState({ boxes: [], status: "error", message });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    const url = this.state.input.trim();
    if (!/^https?:\/\/\S+$/i.test(url)) {
      this.showError("Please enter an image URL starting with http:// or https://");
      return;
    }
    this.setState((state) => ({
      imageUrl: url,
      boxes: [],
      status: "loading",
      message: "Detecting faces…",
      requestId: state.requestId + 1,
    }));
  };

  // Called once the image has loaded (with CORS) into the page.
  onImageLoad = (event, requestId) => {
    const image = event.target;
    detectFaces(image)
      .then((result) => {
        if (requestId !== this.state.requestId) return; // a newer image was submitted
        this.displayFaceBox(this.calculateFaceLocation(result, image));
      })
      .catch((err) => {
        if (requestId !== this.state.requestId) return;
        console.error("Face detection failed:", err);
        this.showError(
          err && err.name === "SecurityError"
            ? "This image can't be analyzed because its site doesn't allow other apps to read it (CORS). Try an image from Unsplash or Pexels."
            : "Something went wrong while detecting faces. Please try again or use a different image."
        );
      });
  };

  onImageError = (requestId) => {
    if (requestId !== this.state.requestId) return;
    this.showError(
      "Couldn't load that image. Check the URL points directly to an image file, or try another site — some sites block other apps from using their images (CORS). Images from Unsplash or Pexels work well."
    );
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { imageUrl, boxes, status, message, requestId } = this.state;
    return (
      <div className="App">
        {/* <Logo /> */}
        {/* <Rank name={this.state.user.name} entries={this.state.user.entries} /> */}
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
          isLoading={status === "loading"}
        />
        {message && (
          <p
            className={`status-message f5 ${status === "error" ? "error" : ""}`}
            role={status === "error" ? "alert" : "status"}
          >
            {message}
          </p>
        )}
        <br />
        <FaceRecognition
          boxes={boxes}
          imageUrl={imageUrl}
          requestId={requestId}
          onImageLoad={this.onImageLoad}
          onImageError={this.onImageError}
        />
      </div>
    );
  }
}

export default App;
