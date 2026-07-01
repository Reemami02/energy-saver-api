const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  image: {
    type: String, // URL or file path
    default: null
  }
});

module.exports = mongoose.model("Room", roomSchema);
