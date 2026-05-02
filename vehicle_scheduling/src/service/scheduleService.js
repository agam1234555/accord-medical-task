const { fetchDepots, fetchVehicles } = require("../repository/scheduleRepository");
const { Log } = require("../../../logging_middleware/logger");

const knapsack = (tasks, capacity) => {
  const n = tasks.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const duration = Math.round(tasks[i - 1].Duration);
    const impact = tasks[i - 1].Impact;
    for (let w = 0; w <= capacity; w++) {
      if (duration <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - duration] + impact);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  const selected = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(tasks[i - 1]);
      w -= Math.round(tasks[i - 1].Duration);
    }
  }

  return {
    selectedTasks: selected,
    totalImpact: dp[n][capacity],
    hoursUsed: capacity - w,
  };
};

const computeSchedule = async () => {
  await Log("backend", "info", "service", "Service: computeSchedule started");

  const depots = await fetchDepots();
  const vehicles = await fetchVehicles();

  await Log("backend", "info", "service", `Service: ${depots.length} depots, ${vehicles.length} tasks loaded`);

  const results = [];

  for (const depot of depots) {
    await Log("backend", "info", "service", `Service: running knapsack for depot ${depot.ID} capacity ${depot.MechanicHours}`);

    const { selectedTasks, totalImpact, hoursUsed } = knapsack(vehicles, depot.MechanicHours);

    await Log("backend", "info", "service", `Service: depot ${depot.ID} — hoursUsed=${hoursUsed}, totalImpact=${totalImpact}, tasks=${selectedTasks.length}`);

    results.push({
      depotId: depot.ID,
      hoursAvailable: depot.MechanicHours,
      hoursUsed,
      totalImpact,
      totalTasksSelected: selectedTasks.length,
      selectedTasks,
    });
  }

  await Log("backend", "info", "service", "Service: computeSchedule complete");
  return { success: true, results };
};

module.exports = { computeSchedule };