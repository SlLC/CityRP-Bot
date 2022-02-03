const { Schema, model } = require("mongoose");

//Guild Schema
const Guild = new Schema({
  _id: String,

  Loggers: {
    Leaderboard: {
      LastMessage: String,
      Channel: String,
    },
  },
});

module.exports = model("Guild", Guild);
