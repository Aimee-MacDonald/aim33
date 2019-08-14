const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  title: {type: String, required: true},
});

module.exports = mongoose.model("todo", schema);
