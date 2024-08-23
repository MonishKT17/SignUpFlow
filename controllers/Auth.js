import User from "../models/user";
import otpGenerator from "otp-generator";
import OTP from "../models/OTP";
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env["JWT_SECRET"];
//sendOtp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from req body
    const { email } = req.body;

    //check if user already exist or not
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exist",
      });
    }
    //generate a otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("generated otp", otp);

    //check otp is unique or not
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    //store otp in db
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log(otpPayload);

    //return response
    return res.status(200).json({
      success: true,
      message: "Otp sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

//signup
exports.signUp = async (req, res) => {
  try {
    //fetch data from req body
    const { fullName, email, password, confirmPassword, mobileNumber, otp } =
      req.body;
    //perform validation
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !mobileNumber ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    //2 passwords match or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword value does not match",
      });
    }
    //check user already exist
    const checkUserExist = await User.findOne({ email });
    if (checkUserExist) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }
    //validate the otp entered by user on UI
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("recentOtp:", recentOtp);
    if (recentOtp == 0) {
      //OTP not found
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp != recentOtp.otp) {
      //Invalid OTP
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create entry in db
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      mobileNumber,
    });
    //return response
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    //fetch data
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    //check for user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first",
      });
    }
    //check password and generate token
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: _id,
      };
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1h",
      });
      user.token = token;
      user.password = undefined;
      //create cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true, //only server side access
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};
