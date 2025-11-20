import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let readings = []; // STORE DATA

// API Get ------> ALL 
app.get("/api/readings", (req, res) => {
  res.json(readings);
});

// API Get with filter -----> last some minutes
app.get("/api/readings/filter", (req, res) => {
  const { minutes } = req.query;

// ERORR message
  if (!minutes) {
    return res.status(400).json({ error: "Minutes is required" });
  }

  const cutoff = Date.now() - minutes * 60 * 1000;

  const filtered = readings.filter(r => new Date(r.timestamp).getTime() >= cutoff);

  res.json(filtered);
});

// subscriber.js in API
import("./subscriber.js").then(module => {
  module.default((data) => {
    readings.push(data);

    // max Reading=5000
    if (readings.length > 5000) {
      readings.shift();
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
