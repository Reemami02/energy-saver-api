const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./src/config/db");
require("./src/config/mqtt");


const authRoutes = require("./src/routes/auth.routes");
const roomRoutes = require("./src/routes/room.routes");
const deviceRoutes = require("./src/routes/device.routes");
const readingRoutes = require("./src/routes/reading.routes");
const statsRoutes = require("./src/routes/stats.routes");
const scheduleRoutes = require("./src/routes/schedule.routes");
const chatRoutes = require("./src/routes/chat.routes");

const app = express();



app.use(cors());
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
