const axios = require("axios");

let TOKEN = "";

const setToken = (token) => {
  TOKEN = token;
};

const Log = async (stack, level, packageName, message) => {
  try {
    const res = await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack: stack,
        level: level,
        package: packageName,
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("[Logger] Failed:", err.response?.data || err.message);
  }
};

module.exports = { Log, setToken };