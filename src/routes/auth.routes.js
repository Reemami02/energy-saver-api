
const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.delete("/me", authMiddleware,controller.deleteUser);
router.put("/me", authMiddleware,controller.updateMe);

module.exports = router;
