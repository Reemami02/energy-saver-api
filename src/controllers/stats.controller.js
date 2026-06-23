const Reading = require("../models/Reading");
const mongoose = require("mongoose");

exports.getMonthlyStats = async (req, res) => {
  try {
    const { deviceId, month, year } = req.query;

    const monthNum = Number(month);
    const yearNum = Number(year);

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 1);

    const data = await Reading.aggregate([
      {
        $match: {
          deviceId: new mongoose.Types.ObjectId(deviceId),
          createdAt: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $facet: {
          // 🔹 استهلاك كل يوم
          daily: [
            {
              $group: {
                _id: { day: { $dayOfMonth: "$createdAt" } },
                totalPower: { $sum: "$power" }
              }
            },
            { $sort: { "_id.day": 1 } },
            {
              $project: {
                _id: 0,
                day: "$_id.day",
                totalPower: 1
              }
            }
          ],

          // 🔹 ملخص الشهر
          summary: [
            {
              $group: {
                _id: null,
                monthlyTotal: { $sum: "$power" },
                monthlyAverage: { $avg: "$power" }
              }
            }
          ]
        }
      }
    ]);

    res.json({
      daily: data[0].daily,
      monthlyTotal: data[0].summary[0]?.monthlyTotal || 0,
      monthlyAverage: data[0].summary[0]?.monthlyAverage || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Error calculating monthly stats" });
  }
};
exports.getYearlyStats = async (req, res) => {
  try {
    const { deviceId, year } = req.query;

    const yearNum = Number(year);

    const startDate = new Date(yearNum, 0, 1);
    const endDate = new Date(yearNum + 1, 0, 1);

    const data = await Reading.aggregate([
      {
        $match: {
          deviceId: new mongoose.Types.ObjectId(deviceId),
          createdAt: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $facet: {
          // 🔹 استهلاك كل شهر
          monthly: [
            {
              $group: {
                _id: { month: { $month: "$createdAt" } },
                totalPower: { $sum: "$power" }
              }
            },
            { $sort: { "_id.month": 1 } },
            {
              $project: {
                _id: 0,
                month: "$_id.month",
                totalPower: 1
              }
            }
          ],

          // 🔹 ملخص السنة
          summary: [
            {
              $group: {
                _id: null,
                yearlyTotal: { $sum: "$power" },
                yearlyAverage: { $avg: "$power" }
              }
            }
          ]
        }
      }
    ]);

    res.json({
      monthly: data[0].monthly,
      yearlyTotal: data[0].summary[0]?.yearlyTotal || 0,
      yearlyAverage: data[0].summary[0]?.yearlyAverage || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Error calculating yearly stats" });
  }
};
