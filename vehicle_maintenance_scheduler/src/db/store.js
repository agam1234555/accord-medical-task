const { Log } = require("../../../logging_middleware/logger");

let vehicles = [];

const getAll = async () => {
  await Log("backend", "debug", "db", "Fetching all vehicles from store");
  return vehicles;
};

const getById = async (id) => {
  await Log("backend", "debug", "db", `Fetching vehicle by id: ${id}`);
  return vehicles.find((v) => v.id === id) || null;
};

const getByVehicleNumber = async (vehicleNumber) => {
  await Log("backend", "debug", "db", `Checking duplicate vehicle number: ${vehicleNumber}`);
  return vehicles.find((v) => v.vehicleNumber === vehicleNumber) || null;
};

const insert = async (vehicle) => {
  await Log("backend", "info", "db", `Inserting vehicle: ${vehicle.vehicleNumber}`);
  vehicles.push(vehicle);
  return vehicle;
};

const update = async (id, updatedFields) => {
  await Log("backend", "info", "db", `Updating vehicle id: ${id}`);
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return null;
  vehicles[index] = { ...vehicles[index], ...updatedFields, updatedAt: new Date().toISOString() };
  return vehicles[index];
};

const remove = async (id) => {
  await Log("backend", "info", "db", `Deleting vehicle id: ${id}`);
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return false;
  vehicles.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, getByVehicleNumber, insert, update, remove };