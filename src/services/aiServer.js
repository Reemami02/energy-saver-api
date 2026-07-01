const axios = require("axios");
const { mapDevicePayload } = require("./ai.adapter");

// ==========================
// PREDICT API
// ==========================
exports.sendToPredictAI = async (device, reading, token) => {
  try {
    const payload = mapDevicePayload(device, reading , token);

    const response = await axios.post(
      "http://64.225.101.222:8000/predict",
      payload,
      {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    );
    console.log("========== PAYLOAD TO AI ==========");
    console.log(JSON.stringify(payload, null, 2));
    console.log("========== AI RESPONSE ==========");
console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Predict AI Error:", error.message);
    return null;
  }
};


// ==========================
// CHATBOT API
// ==========================
exports.sendToChatAI = async (message) => {
  try {
    const response = await axios.post(
      "http://64.225.101.222:8000/chat/general",
      {
        message
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Chat AI Error:",
      error.response?.data || error.message
    );
    return null;
  }
};
