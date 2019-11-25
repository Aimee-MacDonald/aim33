const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  domain: {type: String, required: true},
  searchCount: {type: Number, required: true}
});

module.exports = mongoose.model("domainCheck", schema);
