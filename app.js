const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const csurf = require("csurf");
const mongoose = require("mongoose");
const request = require("request");

const todo = require(path.join(__dirname, "/dbmodels/todo"));
const DomainCheck = require(path.join(__dirname, "/dbmodels/domainCheck"));

const admin = require(path.join(__dirname, "/routes/admin"));

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

passport.serializeUser(function(uid, done){
  done(null, uid);
});

passport.deserializeUser(function(uid, done){
  done(null, uid);
});

app.get("/", (req, res) => {
  res.status(200).render("holding", {csrfToken: req.csrfToken()});
});

app.get("/index", (req, res) => {
  res.status(200).render("index");
});

app.post("/checkDomain", (req, res) => {
  DomainCheck.find({'domain': req.body.domain}, (err, docs) => {
    if(err) throw err;

    if(docs.length > 0){
      docs[0].searchCount++;
      docs[0].save(err => {
        if(err) throw err;
      });
    } else {
      var check = new DomainCheck({
        domain: req.body.domain,
        searchCount: 1
      });

      check.save(err => {
        if(err) throw err;
      });
    }
  });

  var options = {
    url: 'https://api.ote-godaddy.com/v1/domains/available?domain=' + req.body.domain,
    headers: {
      'Authorization': 'sso-key ' + process.env.GDAPI + ':' + process.env.GDSECRET
    }
  };

  function callback(error, response, body){
    if(error) throw error;

    if(res.statusCode == 200){
      var respac = {
        'domain': req.body.domain,
        'available': true
      }

      var b = JSON.parse(body);
      if(b.available == false){
        respac.available = false;
      }

      res.status(200).send(respac);
    }
  }

  request(options, callback);
});

app.get("/thanks", (req, res) => {
  res.status(200).render("thanks");
});

app.listen(process.env.PORT || 8080);
