const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const csurf = require("csurf");

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

passport.serializeUser(function(uid, done){
  done(null, uid);
});

passport.deserializeUser(function(uid, done){
  done(null, uid);
});

app.get("/", (req, res) => {
  res.status(200).render("holding");
});

app.get("/admin", (req, res) => {
  if(req.isAuthenticated()){
    res.status(200).render("admin");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.status(200).render("login", {csrfToken: req.csrfToken()});
});

app.post("/login", (req, res) => {
  console.log("pw: " + req.body.pw);
  console.log("pw: " + process.env.ADMIN);
  if(req.body.pw === process.env.ADMIN){
    req.login(process.env.ADMIN, function(err){
      if(err) throw err;
      res.redirect("admin");
    });
  } else {
    console.log("Wrong Password");
  }
});

app.listen(process.env.PORT || 8080);
