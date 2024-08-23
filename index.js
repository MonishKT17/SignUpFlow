// app create
import express from "express";
const app = express(); //creating an instance
//port find krna
const PORT = 4000; //process.env.PORT ||

//add middleware
app.use(express.json());

//db connect
import { dbconnect } from "./configuration/database.js"; // Update file extension to .js

//api route mount
const signUp = require("./routes/signUp");
app.use("/api/v1/signUp", signUp);

//activate server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
