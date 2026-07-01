const Room = require("../models/Room");
const Device = require("../models/Device");
const Reading = require("../models/Reading");

exports.addRoom = async (req, res) => {
  try {
    const room = await Room.create({
      name: req.body.name,
      image: req.body.image,
      userId: req.userId
    });

    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: "Error creating room" });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ userId: req.userId });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const updateData = {};

    // لو بعت الاسم حدثه
    if (req.body.name) updateData.name = req.body.name;

    // لو بعت الصورة حدثها
    if (req.body.image) updateData.image = req.body.image;

    // لو مفيش حاجة تتحدث
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({
      message: "Room updated successfully",
      room
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    const devices = await Device.find({ roomId });

    const deviceIds = devices.map(d => d._id);

    // امسحي كل القراءات
    await Reading.deleteMany({ deviceId: { $in: deviceIds } });

    // امسحي الأجهزة
    await Device.deleteMany({ roomId });

    // امسحي الغرفة
    await Room.findByIdAndDelete(roomId);

    res.json({ message: "Room, devices and readings deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting room",
      error: err.message
    });
  }
};
  