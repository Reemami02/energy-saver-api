const Device = require("../models/Device");

module.exports = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ message: "API Key required" });
    }

    const device = await Device.findOne({ apiKey });

    if (!device) {
      return res.status(401).json({ message: "Invalid API Key" });
    }


    req.device = device;
    next();
  } catch (err) {
    res.status(500).json({ message: "Device auth failed" });
  }
};
