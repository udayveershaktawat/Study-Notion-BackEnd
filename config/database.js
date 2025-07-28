const mongoose = require("mongoose");

require("dotenv").config();

exports.connectWithDb = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("db connection successfully done");
    })
    .catch((error) => {
      console.error(error);
      console.log("db connection error");
      process.exit(1);
    });
};
