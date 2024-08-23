import express from "express";
const router = express.Router();
import { sendOTP, signUp, login } from "../controllers/Auth";

//api roure
router.post("/sendOTP", sendOTP);
router.post("/signUp", signUp);
router.post("/login", login);

module.exports = router;
