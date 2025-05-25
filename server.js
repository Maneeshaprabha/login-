const express = require("express");
const cors  = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { env } = require("process");


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
const secret = env.JWT_SECRET;

// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });




app.post("/login", async (req, res) => {
  const { email, password , user: username } = req.body;

 const foundUser = users.find((u) => u.email === email && u.user === username); 
  if (!foundUser) {
    return res.status(400).json({ message: "User not found" });
  }
  const valid = await bcrypt.compare(password, foundUser.password);
  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ email: foundUser.email }, secret, { expiresIn: "1d" });

  res.json({ token });
});


app.post("/register", async (req, res) => {
  const { email, password, user } = req.body;


  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    email,
    password: hashedPassword,
    user
  };

  users.push(newUser);
  res.json({ message: "User registered successfully" });
});


console.log("Available users:", users);


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
