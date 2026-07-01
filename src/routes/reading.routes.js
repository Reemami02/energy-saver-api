const express = require("express");
const router = express.Router();
const readingController = require("../controllers/reading.controller");
const deviceAuth = require("../middlewares/deviceAuth.middleware");
const deviceController = require("../controllers/device.controller"); 

router.post("/", deviceAuth, readingController.addReading);
router.get("/device/:deviceId", readingController.getDeviceReadings);
router.get("/:deviceId", deviceController.getDeviceWithLatestReading);

module.exports = router;
