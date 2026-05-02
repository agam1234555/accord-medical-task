const express = require("express");
const router = express.Router();
const { getSchedule } = require("../controller/scheduleController");
const { Log } = require("../../../logging_middleware/logger");

router.use(async (req, res, next) => {
  await Log("backend", "info", "route", `${req.method} ${req.originalUrl} - route accessed`);
  next();
});

router.get("/schedule", async (req, res) => {
  await Log("backend", "info", "route", "GET /api/schedule - schedule route hit");
  await getSchedule(req, res);
});

module.exports = router;