const { v4: uuidv4 } = require("uuid");

const createVehicle = (data) => {
  const lastServiceDate = new Date(data.lastServiceDate);
  const serviceIntervalDays = parseInt(data.serviceIntervalDays, 10);

  const nextServiceDate = new Date(lastServiceDate);
  nextServiceDate.setDate(nextServiceDate.getDate() + serviceIntervalDays);

  return {
    id: uuidv4(),
    vehicleNumber: data.vehicleNumber.toUpperCase().trim(),
    ownerName: data.ownerName.trim(),
    model: data.model.trim(),
    lastServiceDate: lastServiceDate.toISOString().split("T")[0],
    serviceIntervalDays: serviceIntervalDays,
    nextServiceDate: nextServiceDate.toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const validateVehicle = (data) => {
  const errors = [];
  if (!data.vehicleNumber || typeof data.vehicleNumber !== "string")
    errors.push("vehicleNumber is required");
  if (!data.ownerName || typeof data.ownerName !== "string")
    errors.push("ownerName is required");
  if (!data.model || typeof data.model !== "string")
    errors.push("model is required");
  if (!data.lastServiceDate || isNaN(new Date(data.lastServiceDate).getTime()))
    errors.push("lastServiceDate must be valid date YYYY-MM-DD");
  if (!data.serviceIntervalDays || isNaN(parseInt(data.serviceIntervalDays, 10)) || parseInt(data.serviceIntervalDays, 10) <= 0)
    errors.push("serviceIntervalDays must be positive integer");
  return { valid: errors.length === 0, errors };
};

const daysUntilService = (nextServiceDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(nextServiceDate);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
};

module.exports = { createVehicle, validateVehicle, daysUntilService };