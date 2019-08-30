const express = require("express");
const router = express.Router();
const path = require("path");

const todo = require(path.join(__dirname, "../dbmodels/todo"));

router.get("/", (req, res) => {
  if(req.isAuthenticated()){
    res.status(200).render("admin", {csrfToken: req.csrfToken()});
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/login", (req, res) => {
  res.status(200).render("login", {csrfToken: req.csrfToken()});
});

router.post("/login", (req, res) => {
  if(req.body.pw === process.env.ADMIN){
    req.login(process.env.ADMIN, function(err){
      if(err) throw err;
      res.redirect("/admin");
    });
  } else {
    console.log("Wrong Password");
  }
});

router.get("/todos", (req, res) => {
  todo.find({}, function(err, docs){
    if(err){
      throw err;
    } else {
      res.status(200).send(docs);
    }
  })
});

router.post("/todo", (req, res) => {
  var newTodo = new todo({
    'title': req.body.todo
  });

  newTodo.save(err => {
    if(err) throw err;
    res.redirect("/admin")
  });
});

router.post("/tickTodo", (req, res) => {
  todo.findByIdAndDelete(req.body.id, function(err){
    if(err) throw err;
  });
  res.redirect("/admin");
});

router.get("/survey", (req, res) => {
  if(req.isAuthenticated()){
    res.status(200).render("survey");
  } else {
    res.redirect("/admin/login");
  }
});

module.exports = router;
