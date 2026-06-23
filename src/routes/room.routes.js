const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth, roomController.addRoom);
router.get("/", auth, roomController.getRooms);
router.put("/:id", auth, roomController.updateRoom);
router.delete("/:roomId", auth, roomController.deleteRoom);


module.exports = router;
