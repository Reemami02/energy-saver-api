import mqtt from "mqtt";
import fs from "fs";

const broker = "mqtts://20c5c1cff368482abdad857fd0b9c3bf.s1.eu.hivemq.cloud:8883";

const options = {
  username: "Energy-Saver",
  password: "Energysaver003",
  reconnectPeriod: 1000
};

const topic = "reem/sensor/data";

const client = mqtt.connect(broker, options);

client.on("connect", () => {
  console.log("✅ Subscriber connected to HiveMQ!");
  client.subscribe(topic, () => {
    console.log(`📡 Subscribed to: ${topic}`);
  });
});

client.on("message", (topic, message) => {
  const data = JSON.parse(message.toString());
  console.log("📥 Received:", data);

  let fileData = [];

  if (fs.existsSync("readings.json")) {
    fileData = JSON.parse(fs.readFileSync("readings.json"));
  }

  fileData.push(data);

  fs.writeFileSync("readings.json", JSON.stringify(fileData, null, 2));

  console.log("💾 Saved to readings.json");
});
export default function onNewData(callback) {
  client.on("message", (topic, payload) => {
    const data = JSON.parse(payload.toString());
    console.log("📥 Received:", data);
    callback(data);
  });
}

