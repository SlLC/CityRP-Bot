const { Schema, model } = require("mongoose");

//User schema
const User = new Schema({
  user: String,

  guild: String,

  messages: Number,
});

module.exports = model("User", User);
