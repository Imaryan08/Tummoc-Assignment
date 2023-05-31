const express = require("express");
const ejs = express("ejs");
const passport = require("passport");
const { initializingPassport, isAuthenticated } = require("./configs/passport");
const expressSession = require("express-session");

const User = require("./models/user.model");
const userController = require("./controllers/user.controller");

const app = express();

initializingPassport(passport);

app.use(
  expressSession({ secret: "secret", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engines", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userController);

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/register", async (req, res) => {
  res.render("register.ejs");
});

app.get("/login", async (req, res) => {
  res.render("login.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).lean();

    if (user) return res.status(404).send("User already exist");

    const newUser = await User.create(req.body);
    return res.status(200).redirect("/login");
  } catch (error) {
    return res.status(400).send("Failed to create user");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  }),
  async (req, res) => {}
);

app.get("/profile", isAuthenticated, async (req, res) => {
  res.send(req.user);
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect("/");
  });
});

module.exports = app;
