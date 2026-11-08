// Copies the MediaPipe Tasks Vision wasm runtime from node_modules into
// public/ so the app serves it itself (no CDN, no API key, no backend).
// Runs automatically before `npm start` and `npm run build`.
const fs = require("fs");
const path = require("path");

const src = path.join(
  __dirname,
  "..",
  "node_modules",
  "@mediapipe",
  "tasks-vision",
  "wasm"
);
const dest = path.join(__dirname, "..", "public", "mediapipe", "wasm");

const files = [
  "vision_wasm_internal.js",
  "vision_wasm_internal.wasm",
  "vision_wasm_nosimd_internal.js",
  "vision_wasm_nosimd_internal.wasm",
];

fs.mkdirSync(dest, { recursive: true });
for (const file of files) {
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
}
console.log(`Copied MediaPipe wasm files to ${path.relative(process.cwd(), dest)}`);
