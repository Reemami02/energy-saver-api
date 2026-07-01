function mapDevicePayload(device, reading, message = null) {
console.log("device.state =", device.state);
console.log("device.userId =", device.userId);
console.log("device.userId.token =", device.userId?.token);

const payload = {
  message,

  device_type: device.name,
  device_id: device._id.toString(),

  voltage: reading.voltage,
  current: reading.current,
  power_w: reading.power,

  temperature_c: reading.temperature,
  humidity_percent: reading.humidity,

  state: device.state,
  created_at: reading.createdAt,
  token: device.userId?.token
};

console.log("Payload inside mapper:", payload);

return payload;  return {
    message,

    device_type: device.name,
    device_id: device._id.toString(),

    voltage: reading.voltage,
    current: reading.current,
    power_w: reading.power,

    temperature_c: reading.temperature,
    humidity_percent: reading.humidity,

    state: device.state,

    created_at: reading.createdAt,

    // User JWT Token
    token: device.userId.token
  };
}

module.exports = { mapDevicePayload };