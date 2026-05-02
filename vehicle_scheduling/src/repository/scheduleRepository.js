const axios = require("axios");
const { Log } = require("../../../logging_middleware/logger");
const { setToken } = require("../../../logging_middleware/logger");

const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";
const BASE_URL = "http://20.207.122.201/evaluation-service";

const getToken = async () => {
  const res = await axios.post(AUTH_URL, {
    email: "ab5903@srmist.edu.in",
    name: "Agam Singh Bhatia",
    rollNo: "RA2311003011642",
    accessCode: "QkbpxH",
    clientID: "8b2a6b3f-af39-4220-8afe-40a4d2aa91ad",
    clientSecret: "zCdwcWrFrfKECShs"
  });
  const token = res.data.access_token;
  setToken(token);
  return token;
};

const fetchDepots = async () => {
  await Log("backend", "info", "repository", "Repository: fetching depots");
  const token = await getToken();
  try {
    const res = await axios.get(`${BASE_URL}/depots`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await Log("backend", "info", "repository", `Repository: got ${res.data.depots.length} depots`);
    return res.data.depots;
  } catch (err) {
    await Log("backend", "error", "repository", `Repository: fetchDepots failed - ${err.message}`);
    throw err;
  }
};

const fetchVehicles = async () => {
  await Log("backend", "info", "repository", "Repository: fetching vehicles");
  const token = await getToken();
  try {
    const res = await axios.get(`${BASE_URL}/vehicles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await Log("backend", "info", "repository", `Repository: got ${res.data.vehicles.length} vehicles`);
    return res.data.vehicles;
  } catch (err) {
    await Log("backend", "error", "repository", `Repository: fetchVehicles failed - ${err.message}`);
    throw err;
  }
};

const setRepoToken = (token) => {};

module.exports = { fetchDepots, fetchVehicles, setRepoToken };