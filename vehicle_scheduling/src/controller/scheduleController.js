const { computeSchedule } = require("../service/scheduleService");
const { Log } = require("../../../logging_middleware/logger");

const getSchedule = async (req, res) => {
  await Log("backend", "info", "controller", "Controller: getSchedule invoked");
  try {
    const result = await computeSchedule();
    await Log("backend", "info", "controller", `Controller: schedule computed for ${result.results.length} depots`);
    return res.status(200).json(result);
  } catch (err) {
    await Log("backend", "error", "controller", `Controller: getSchedule failed - ${err.message}`);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getSchedule };