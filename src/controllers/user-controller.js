const express = require("express");
const router = express.Router();

const User = require("../models/user-model");

const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, async (req, res) => {
  try {
    const users = await User.find().lean().exec();
    res.status(200).json({
      status: "Success",
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      status: "User created",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      error: error.message,
    });
  }
});

module.exports = router;
