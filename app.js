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
    res.status(200).render("admin", {csrfToken: req.csrfToken()});
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.status(200).render("login", {csrfToken: req.csrfToken()});
});

app.get("/todos", (req, res) => {
  todo.find({}, function(err, docs){
    if(err){
      throw err;
    } else {
      res.status(200).send(docs);
    }
  })
});

app.post("/login", (req, res) => {
  if(req.body.pw === process.env.ADMIN){
    req.login(process.env.ADMIN, function(err){
      if(err) throw err;
      res.redirect("admin");
    });
  } else {
    console.log("Wrong Password");
  }
});

app.post("/todo", (req, res) => {
  var newTodo = new todo({
    'title': req.body.todo
  });

  newTodo.save(err => {
    if(err) throw err;
    res.redirect("/admin")
  });
});

app.post("/tickTodo", (req, res) => {
  todo.findByIdAndDelete(req.body.id, function(err){
    if(err) throw err;
  });
  res.redirect("/admin");
});

app.listen(process.env.PORT || 8080);
