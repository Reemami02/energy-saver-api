const Device = require("../models/Device");
const Room = require("../models/Room");
const Reading = require("../models/Reading");
const mqttClient = require("../config/mqtt");

exports.addDevice = async (req, res) => {
  const { name, roomId } = req.body;

  try {
    const room = await Room.findOne({
      _id: roomId,
      userId: req.userId
    });

    if (!room)
      return res.status(403).json({ message: "Unauthorized room" });

    const device = await Device.create({
      name,
      roomId,
      userId: req.userId
    });

    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ message: "Error adding device" });
  }
};

exports.getDevicesByRoom = async (req, res) => {
  try {
    const devices = await Device.find({
      roomId: req.params.roomId,
      userId: req.userId

    });

    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: "Error fetching devices" });
  }
};
exports.getUserDevices = async (req, res) => {
  try {
    const userId = req.userId;

    const rooms = await Room.find({ userId });

    const roomIds = rooms.map(room => room._id);

    const devices = await Device.find({ roomId: { $in: roomIds } });

    const result = rooms.map(room => ({
      room: room.name,
      devices: devices.filter(d => d.roomId.toString() === room._id.toString())
    }));

    res.json(result);

  } catch (err) {
    console.log("GET USER DEVICES ERROR:", err);
    res.status(500).json({ message: err.message, error: err });
  }
};



exports.updateDeviceState = async (req, res) => {
  try {
    const { state } = req.body;

    if (!["on", "off"].includes(state)) {
      return res.status(400).json({ message: "Invalid state value" });
    }

    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { state },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // جزء الربط مع الريلار
    const topic = `energy/device/${device._id}/control`;
    const command = state === "on" ? "ON" : "OFF";
    mqttClient.publish(topic, command);

    res.json({
      message: "Device state updated successfully",
      device
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateDevice = async (req, res) => {
  try {
    const updateData = {};

    // تحديث الاسم لو اتبعت
    if (req.body.name) updateData.name = req.body.name;

    // تحديث الصورة لو اتبعت
    if (req.body.image) updateData.image = req.body.image;

    // لو مفيش حاجة تتحدث
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    const device = await Device.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // صححنا هنا
      updateData,
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json({
      message: "Device updated successfully",
      device
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.deleteDevice = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;

    // امسحي قراءات الجهاز
    await Reading.deleteMany({ deviceId });

    // امسحي الجهاز نفسه
    await Device.findByIdAndDelete(deviceId);

    res.json({ message: "Device and its readings deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting device",
      error: err.message
    });
  }
};

exports.getDeviceWithLatestReading = async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId)
      .populate("latestReading");

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json(device);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching device",
      error: err.message
    });
  }
};

exports.turnOffAllDevices = async (req, res) => {
  try {

    // هات كل أجهزة المستخدم
    const devices = await Device.find({
      userId: req.userId
    });

    // حدث الحالة في الداتا بيز
    await Device.updateMany(
      { userId: req.userId },
      { state: "off" }
    );

    // ابعت أمر OFF لكل جهاز
    devices.forEach((device) => {

      const topic = `energy/device/${device._id}/control`;

      mqttClient.publish(topic, "OFF");
    });

    res.json({
      message: "All devices turned off successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};