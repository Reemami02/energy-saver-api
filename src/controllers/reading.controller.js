const Reading = require("../models/Reading");
const Device = require("../models/Device");

const aiServer = require("../services/aiServer");

// ==============================
// ADD READING
// ==============================
exports.addReading = async (req, res) => {
  try {
   const {
    voltage,
    current,
    power,
    temperature,
    humidity,
    state
        } = req.body;

    if (
      voltage === undefined ||
      current === undefined ||
      power === undefined
    ) {
      return res.status(400).json({
        message: "Missing sensor data",
      });
    }

    const device = req.device;

    const deviceWithUser = await Device
    .findById(device._id)
    .populate("userId");

if (!deviceWithUser) {
    return res.status(404).json({
        message: "Device not found"
    });
}

    // ==============================
    // 1. SAVE READING
    // ==============================
    const reading = await Reading.create({
      deviceId: device._id,
      voltage,
      current,
      power,
      temperature,
      humidity
    });
    deviceWithUser.state = state;
    deviceWithUser.latestReading = reading._id;

    await deviceWithUser.save();
    
    
    const token = deviceWithUser.userId.token;
   const predictResult = await aiServer.sendToPredictAI(
   deviceWithUser,
   reading,
   token
  ).catch((err) => {
  console.error("Predict AI Error:", err.message);
  return null;
  });  
    if (predictResult)
       { reading.aiPrediction
         = { recommendation: predictResult.recommendation
          , state: predictResult.state
          , status: predictResult.status
          , device_Type: predictResult.device_Type, };
           await reading.save(); }



    // ==============================
    // 4. RESPONSE
    // ==============================
    return res.status(201).json({
      message: "Reading saved successfully",
      reading,

      ai: {
        predict: predictResult,
      },
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Error saving reading",
    });
  }
};

// ==============================
// GET DEVICE READINGS
// ==============================
exports.getDeviceReadings = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const readings = await Reading.find({ deviceId })
      .sort({ createdAt: -1 });

    res.json({
      message: "Device readings",
      count: readings.length,
      readings,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching readings",
      error: err.message,
    });
  }
};