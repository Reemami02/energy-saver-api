const mqtt = require("mqtt");
const Reading = require("../models/Reading");
const Device = require("../models/Device");


// الاتصال بالـ broker
const client = mqtt.connect("mqtts://broker.hivemq.com:8883", {
  username: "Energy-Saver",
  password: "Energysaver2026",
});

client.on("connect", () => {
  console.log("✅ MQTT Connected");

  client.subscribe("energy/esp32/power", (err) => {
    if (!err) {
      console.log("📡 Subscribed to ESP32 topic");
    }
  });
});

// استقبال البيانات من ESP32
client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    console.log("📥 Data received:", data);

    const deviceId = data.deviceId;

    const token = device.user.token;
    
    await Reading.create({
      deviceId,
      voltage: data.voltage,
      current: data.current,
      power: data.power,
      temperature: data.temperature,
      humidity: data.humidity
    });

 
    console.log("💾 Saved to DB");

  } catch (err) {
    console.error("❌ MQTT Error:", err.message);
  }
});

module.exports = client;