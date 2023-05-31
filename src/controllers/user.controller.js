const express = require("express");

const User = require("../models/user.model");

const router = express.Router();

router.get("", async (req, res) => {
  try {
    const users = await User.find().lean().exec();
    res.status(200).json({
      users,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
