const Reading = require("../models/Reading");
const Device = require("../models/Device");
const aiServer = require("../services/aiServer");

exports.chat = async (req, res) => {
  try {
    const {  message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const result = await aiServer.sendToChatAI(      message
    );

    return res.json(result);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};