const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({

  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true
  },

  action: {
    type: String,
    enum: ["on", "off"],
    required: true
  },

  time: {
    type: String,
    required: true
  },

  repeatType: {
    type: String,
    enum: ["once", "daily", "custom"],
    default: "once"
  },

  days: [{
    type: String
  }],

  enabled: {
    type: Boolean,
    default: true
  },

  lastExecuted: {
    type: Date,
    default: null
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Schedule", scheduleSchema);