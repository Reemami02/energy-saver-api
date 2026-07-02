const mongoose = require("mongoose");
const crypto = require("crypto");

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},

  image: {
    type: String,
    default: null
  },

  state: {
    type: String,
    enum: ["on", "off"],
    default: "off" ,
    required: true
  },
  latestReading: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Reading",
  default: null
  },
  apiKey: {
    type: String,
    default: () => crypto.randomBytes(16).toString("hex")
  }
});

module.exports = mongoose.model("Device", deviceSchema);
