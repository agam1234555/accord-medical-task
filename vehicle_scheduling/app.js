const express = require("express");
const cors = require("cors");
const { setToken } = require("../logging_middleware/logger");
const { Log } = require("../logging_middleware/logger");
const scheduleRoutes = require("./src/route/scheduleRoute");

const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYjU5MDNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMDE2OCwiaWF0IjoxNzc3Njk5MjY4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYmQ1N2MyNGMtMzJkNC00NzBhLWI4MjktZDc2ZGQ4NTQwODU3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWdhbSBzaW5naCBiaGF0aWEiLCJzdWIiOiI4YjJhNmIzZi1hZjM5LTQyMjAtOGFmZS00MGE0ZDJhYTkxYWQifSwiZW1haWwiOiJhYjU5MDNAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJhZ2FtIHNpbmdoIGJoYXRpYSIsInJvbGxObyI6InJhMjMxMTAwMzAxMTY0MiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjhiMmE2YjNmLWFmMzktNDIyMC04YWZlLTQwYTRkMmFhOTFhZCIsImNsaWVudFNlY3JldCI6InpDZHdjV3JGcmZLRUNTaHMifQ.p1jKkCEIu03waW-rVRq_YayCVzg6_WvxsFduNajCSaw";
setToken(ACCESS_TOKEN);

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

module.exports = app;