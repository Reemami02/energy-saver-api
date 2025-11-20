import mqtt from "mqtt";

const broker = "mqtts://20c5c1cff368482abdad857fd0b9c3bf.s1.eu.hivemq.cloud:8883";

const options = {
  username: "Energy-Saver",
  password: "Energysaver003",
  reconnectPeriod: 1000
};

const topic = "reem/sensor/data";

const client = mqtt.connect(broker, options);

client.on("connect", () => {
  console.log("✅ Publisher connected to HiveMQ!");

  setInterval(() => {
    const data = {
      current: Number((Math.random() * 10).toFixed(2)),
      voltage: Number((210 + Math.random() * 30).toFixed(2)),
      power: Number((Math.random() * 2000).toFixed(2)),
      timestamp: new Date().toISOString(),
    };

    const payload = JSON.stringify(data);

    client.publish(topic, payload);
    console.log("📤 Sent:", payload);
  }, 2000);
});
