const express = require("express");

const router = express.Router();

const scheduleController = require("../controllers/schedule.controller");

router.post("/",scheduleController.createSchedule);

router.get("/",scheduleController.getSchedules);

router.get("/:id",scheduleController.getScheduleById);

router.get("/device/:deviceId",scheduleController.getDeviceSchedules);

router.put("/:id",scheduleController.updateSchedule);

router.delete("/:id",scheduleController.deleteSchedule);

module.exports = router;