const express = require("express");
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.status(200).render("holding");
});

app.get("/todo", (req, res) => {
  res.status(200).render("todo");
})

app.listen(process.env.PORT || 8080);
