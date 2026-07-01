const Schedule = require("../models/Schedule");

exports.createSchedule = async (req, res) => {

  try {

    const schedule = await Schedule.create(req.body);

    res.status(201).json({
      message: "Schedule created successfully",
      schedule
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

exports.getSchedules = async (req, res) => {

  try {

    const schedules = await Schedule
      .find()
      .populate("deviceId");

    res.json(schedules);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

exports.getScheduleById = async (req, res) => {

  try {

    const schedule = await Schedule
      .findById(req.params.id)
      .populate("deviceId");

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found"
      });
    }

    res.json(schedule);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

exports.getDeviceSchedules = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const schedules = await Schedule.find({
      deviceId
    }).sort({ time: 1 });

    res.status(200).json(schedules);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateSchedule = async (req, res) => {

  try {

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found"
      });
    }

    res.json({
      message: "Schedule updated",
      schedule
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

exports.deleteSchedule = async (req, res) => {

  try {

    const schedule = await Schedule.findByIdAndDelete(
      req.params.id
    );

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found"
      });
    }

    res.json({
      message: "Schedule deleted"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};