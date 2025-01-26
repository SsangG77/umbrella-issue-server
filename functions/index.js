
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");


const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();



// CORS 설정 추가
app.use(cors({ origin: true }));

// JSON 파싱 미들웨어 추가
app.use(express.json());

// 예제 API 엔드포인트
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, Firebase!" });
});

app.post("/api/data", (req, res) => {
  const { name, value } = req.body;
  res.json({ message: `Received: ${name}, ${value}` });
});

// Firebase Functions에 Express 앱 연결
exports.api = functions.https.onRequest(app);
