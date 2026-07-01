
const User = require("../models/User");
const Room = require("../models/Room");
const Device = require("../models/Device");
const Reading = require("../models/Reading");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    user.token = token;
    await user.save();
   

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
    

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid email" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  user.token = token;
  await user.save();
  
 const checkUser = await User.findById(user._id);

console.log("Generated Token:", token);
console.log("Saved Token:", checkUser.token);

  res.json({ token ,user: {
      id: user._id,
      name: user.name,
      email: user.email} });
};

exports.updateMe = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, password, image } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (image) updates.image = image;

    if (email) {
      const exist = await User.findOne({ email, _id: { $ne: userId } });
      if (exist) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updates.email = email;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json({
      message: "User updated successfully",
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.userId;

    // 1️⃣ تأكد إن المستخدم موجود
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ هات كل أجهزة المستخدم
    const devices = await Device.find({ userId }).select("_id");

    const deviceIds = devices.map(device => device._id);

    // 3️⃣ امسح قراءات الأجهزة
    await Reading.deleteMany({ deviceId: { $in: deviceIds } });

    // 4️⃣ امسح الأجهزة
    await Device.deleteMany({ userId });

    // 5️⃣ امسح الغرف
    await Room.deleteMany({ userId });

    // 6️⃣ امسح المستخدم
    await User.findByIdAndDelete(userId);

    res.json({
      message: "User, rooms, devices, and readings deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
};
