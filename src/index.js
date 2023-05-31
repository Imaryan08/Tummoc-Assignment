// const express = require("express");
// const passport = require("passport");
// const jwtStrategy = require("./configs/passport-config"); // Path to your passport-config.js file
// const userController = require("./controllers/user-controller");

// const app = express();

// app.use(express.json());

// app.use("/users", userController);

// app.use(passport.initialize());
// passport.use(jwtStrategy);

// module.exports = app;

// server.js
const express = require("express");
const passport = require("passport");
const authenticateUser = require("./middlewares/auth");
const User = require("./models/user-model");
const dbConnection = require("./configs/db");
const jwt = require("jsonwebtoken");

const app = express();

// JSON body parser middleware
app.use(express.json());

// Passport middleware
app.use(passport.initialize());

// Routes
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ userId: user._id }, "your_secret_key", {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.get("/protected-route", authenticateUser, (req, res) => {
  // Access the authenticated user from req.user
  // Handle the protected route logic
  res.json({ message: "Protected route accessed successfully" });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find().lean().exec();
    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Start the server
app.listen(8080, async () => {
  try {
    await dbConnection();
    console.log("Server started on port 3000");
  } catch (err) {
    console.log(err.message);
  }
});
