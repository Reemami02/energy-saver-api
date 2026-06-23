function mapDevicePayload(device, reading, message = null) {
  return {
    message,

    device_type: device.name,
    device_id: device._id.toString(),

    voltage: reading.voltage,
    current: reading.current,
    power_w: reading.power,

    temperature_c: reading.temperature,
    humidity_percent: reading.humidity,

    created_at: reading.createdAt,
  };
}

module.exports = { mapDevicePayload };