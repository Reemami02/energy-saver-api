const cron = require("node-cron");

const Schedule = require("../models/Schedule");
const Device = require("../models/Device");

const mqttClient = require("../config/mqtt");

function getCurrentTime() {
  const now = new Date();

  const hours = String((now.getHours()+3) %24).padStart(2, "0");
    const minutes = String((now.getMinutes()-2+60)%60).padStart(2, "0");


  return `${hours}:${minutes}`;
}

function getTodayName() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long"
  });
}

const startScheduler = () => {

  cron.schedule("* * * * *", async () => {

    try {

      const currentTime = getCurrentTime();
      const today = getTodayName();

      const schedules = await Schedule.find({
        enabled: true,
        time: currentTime
      });

      for (const schedule of schedules) {

        // custom days
        if (
          schedule.repeatType === "custom" &&
          !schedule.days.includes(today)
        ) {
          continue;
        }

        const device = await Device.findById(
          schedule.deviceId
        );

        if (!device) {
          continue;
        }

        console.log(
          `Executing ${schedule.action} for ${device.name}`
        );

        console.log("Executing Schedule");
        console.log("Action:", schedule.action);
        console.log("Device:", device.name);

        const topic = `energy/device/${device._id}/control`;

        const command =
        schedule.action.toLowerCase() === "on"? "ON": "OFF";

        mqttClient.publish(topic, command);
        
        device.state = schedule.action;
        await device.save();

        schedule.lastExecuted = new Date();

        if (schedule.repeatType === "once") {
          schedule.enabled = false;
        }

        await schedule.save();
      }

    } catch (error) {

      console.log(
        "Scheduler Error:",
        error.message
      );

    }

  });

  console.log("✅ Scheduler Started");
};

module.exports = {
  startScheduler
};
