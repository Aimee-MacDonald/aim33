const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const csurf = require("csurf");
const mongoose = require("mongoose");

const todo = require(path.join(__dirname, "/dbmodels/todo"));
const admin = require(path.join(__dirname, "/routes/admin"));
const saldanha = require(path.join(__dirname, "/routes/saldanha"));

mongoose.connect(process.env.ADMINDB, {useNewUrlParser: true});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/static")));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(csurf());

app.use("/admin", admin);
app.use("/saldanha", saldanha);

passport.serializeUser(function(uid, done){
  done(null, uid);
});

passport.deserializeUser(function(uid, done){
  done(null, uid);
});

app.get("/", (req, res) => {
  res.status(200).render("holding");
});

app.listen(process.env.PORT || 8080);
