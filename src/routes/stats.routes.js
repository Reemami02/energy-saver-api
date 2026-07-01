const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/monthly", auth, statsController.getMonthlyStats);
router.get("/yearly", auth, statsController.getYearlyStats);

module.exports = router;
