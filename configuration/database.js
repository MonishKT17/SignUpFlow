const mongoose = require("mongoose");
const MONGO_URI = process.env['MONGO_URI']

export const dbconnect = () => {
  mongoose.connect({
    MONGO_URI,
  }).then(() => {
    console.log("Connected to database")
  })
    .catch((error) => {
      console.log("Error in connecting to database", error);
      process.exit(1);
    });
}