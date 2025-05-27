const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Constants
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("# MongoDB connected"))
.catch((err) => {
  console.error("^ MongoDB connection error:", err.message);
  process.exit(1);
});

// User Schema & Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  user: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Register Route
app.post("/register", async (req, res) => {
  const { email, password, user } = req.body;

  if (!email || !password || !user) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword, user });

  res.status(201).json({ message: "User registered successfully" });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const foundUser = await User.findOne({ email });
  if (!foundUser)
    return res.status(404).json({ message: "User not found" });

  const validPassword = await bcrypt.compare(password, foundUser.password);
  if (!validPassword)
    return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ email: foundUser.email, user: foundUser.user }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
});

// Protected Route Example
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Protected data accessed successfully",
    user: req.user,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`@ Server is running on port ${PORT}`);
});
