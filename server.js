const app = require("./app");
const { startScheduler } = require("./src/services/schedule.service");

startScheduler();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});