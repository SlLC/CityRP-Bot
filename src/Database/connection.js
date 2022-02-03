const { green, redBright } = require("chalk");
const mongoose = require("mongoose");
const config = require("../config");

mongoose
  .connect(config.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(() =>
    console.log(redBright(`[ERROR]: Invalid MongoDB Connection String`))
  );

mongoose.connection.on("connected", () => {
  console.log(green(`[DATABASE]: Connected`));
});
