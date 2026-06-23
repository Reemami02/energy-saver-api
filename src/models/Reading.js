const mongoose = require("mongoose");

const readingSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
  },

  voltage: Number,
  current: Number,
  power: Number,
  temperature: { type: Number, default: null },
humidity: { type: Number, default: null },
  

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Reading", readingSchema);

