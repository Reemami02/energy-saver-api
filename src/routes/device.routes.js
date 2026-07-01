const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/device.controller");
const auth = require("../middlewares/auth.middleware");
const { updateDeviceState } = require("../controllers/device.controller");
const mqttClient = require("../config/mqtt");

router.post("/", auth, deviceController.addDevice);
router.get("/user", auth,deviceController.getUserDevices);
router.get("/:roomId", auth, deviceController.getDevicesByRoom);
router.put("/all/off",auth,deviceController.turnOffAllDevices);
router.put("/:id/state", auth, deviceController.updateDeviceState);
router.put("/:id", auth, deviceController.updateDevice)
router.delete("/:deviceId", auth, deviceController.deleteDevice);


module.exports = router;
