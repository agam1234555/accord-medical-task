const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { setToken } = require("../logging_middleware/logger");
const { Log } = require("../logging_middleware/logger");
const scheduleRoutes = require("./src/route/scheduleRoute");
const { setRepoToken } = require("./src/repository/scheduleRepository");

const app = express();
app.use(cors());
app.use(express.json());

const getToken = async () => {
  const res = await axios.post("http://20.207.122.201/evaluation-service/auth", {
    email: "ab5903@srmist.edu.in",
    name: "Agam Singh Bhatia",
    rollNo: "RA2311003011642",
    accessCode: "QkbpxH",
    clientID: "8b2a6b3f-af39-4220-8afe-40a4d2aa91ad",
    clientSecret: "zCdwcWrFrfKECShs"
  });
  return res.data.access_token;
};

const startServer = async () => {
  const token = await getToken();
  setToken(token);
  setRepoToken(token);
  await Log("backend", "info", "service", "Token fetched and set successfully");

  app.use("/api", scheduleRoutes);

  app.get("/health", async (req, res) => {
    await Log("backend", "info", "route", "Health check hit");
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use(async (req, res) => {
    await Log("backend", "warn", "handler", `404 - ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: "Route not found" });
  });

  app.use(async (err, req, res, next) => {
    await Log("backend", "error", "handler", `Unhandled error: ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    await Log("backend", "info", "service", `Vehicle Scheduling Service started on port ${PORT}`);
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

module.exports = app;