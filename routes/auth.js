const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const allowCors = require("../middleware/allowCors");

// Register route
router.post("/register", allowCors, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route
router.post("/login", allowCors, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🚀 ~ file: auth.js:29 ~ router.post ~ email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, "123", { algorithm: "HS256" });
    console.log("🚀 ~ file: auth.js:38 ~ router.post ~ token:", token);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test token verification
router.get("/test", authMiddleware, allowCors, (req, res) => {
  res.json({ message: "Token verified successfully" });
});

module.exports = router;
