const functions = require("firebase-functions/v2");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require('dotenv').config();

const app = express();

// CORS 설정
app.use(cors({ origin: true }));
app.use(express.json());

// 헬스 체크 엔드포인트 추가
app.get("/", (req, res) => {
  res.status(200).send('Health check OK');
});

const OPENWEATHER_API_KEY = "0053b997aaa002d7cf4f829b74c3ccc5";
const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, sangjin cha" });
});


app.post("/api/data", (req, res) => {
  const { name, value } = req.body;
  res.json({ message: `받은 데이터 : ${name}, ${value}` });
});

app.post("/api/now", async (req, res) => {
  const { lat, lon } = req.body;

  if (!lat || !lon) {
    return res.status(400).json({ error: "위도와 경도를 모두 제공해야 합니다." });
  }

  try {
    const response = await axios.get(OPENWEATHER_URL, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
      },
    });

    const data = response.data;
    const weatherInfo = {
      location: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      rain: data.rain ? data.rain["1h"] || 0 : 0,
      dust: "N/A",
    };

    res.json(weatherInfo);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "날씨 데이터를 가져오는 중 오류" });
  }
});

// Firebase Functions v2로 내보내기
exports.api = functions.https.onRequest({
  memory: "256MiB",
  timeoutSeconds: 540,
  minInstances: 0,
  maxInstances: 10,
}, app);