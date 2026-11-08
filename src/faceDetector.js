// In-browser face detection with MediaPipe Tasks Vision.
// Replaces the old Clarifai API call (Clarifai shut down in 2026), so the demo
// needs no API key, no backend server, and has no cold start.
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

const BASE = process.env.PUBLIC_URL || "";
const WASM_PATH = `${BASE}/mediapipe/wasm`;
const MODEL_PATH = `${BASE}/models/blaze_face_full_range.tflite`;

let detectorPromise = null;

// Loads the model once and reuses it for every detection.
export const getFaceDetector = () => {
  if (!detectorPromise) {
    detectorPromise = FilesetResolver.forVisionTasks(WASM_PATH)
      .then((vision) =>
        FaceDetector.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_PATH, delegate: "CPU" },
          runningMode: "IMAGE",
          minDetectionConfidence: 0.5,
        })
      )
      .catch((err) => {
        detectorPromise = null; // allow a retry on the next click
        throw err;
      });
  }
  return detectorPromise;
};

// Returns MediaPipe's result: { detections: [{ boundingBox: { originX,
// originY, width, height } }] }, in pixels of the image's natural size.
export const detectFaces = async (imageElement) => {
  const detector = await getFaceDetector();
  return detector.detect(imageElement);
};
