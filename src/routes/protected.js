const express = require("express");
const passport = require("passport");

const router = express.Router();

// Middleware for user authentication
const requireAuth = passport.authenticate("jwt", { session: false });

// Protected route example
router.get("/", requireAuth, (req, res) => {
  res.json({ message: "Authenticated user" });
});

module.exports = router;
