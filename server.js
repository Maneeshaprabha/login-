const express = require("express");
const cors  = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const { env } = require("process");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


const bodyParser = require("body-parser");
app.use(bodyParser.json());

const users = [
  {
    email: "test@example.com",
    password:"$2a$10$z6kgxkO8AyYmE9WPC7ERcu6rwAAa9bvlU/1ESy9Sv1BhDN5aSB/Ma" ,
    user: "testuser"
  }
];
require("dotenv").config();
const secret = process.env.JWT_SECRET;



mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB connected"))
.catch((err) => console.error(" MongoDB connection error:", err));

const UserScheme = new mongoose.Schema
({
    email: { type: String, required: true },
    password: { type: String, required: true },
    user: { type: String, required: true }
});

const User = mongoose.model("User", UserScheme);

// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });




app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const foundUser = await User.findOne({ email });
  if (!foundUser)
    return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, foundUser.password);
  if (!valid)
    return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ email: foundUser.email }, secret || "default_secret", {
    expiresIn: "1d",
  });

  res.json({ token });
});






app.post("/register", async (req, res) => {
  const { email, password, user } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword, user });

  res.json({ message: "User registered successfully" });
});



console.log("Available users:", users);


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
