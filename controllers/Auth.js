const User = require("../models/User");
const OTP = require("../models/OTP");
const optGenerator = require("otp-generator");

// send OTP
exports.sendOTP = async (req, res) => {
  try {
    // fet h email from req.body
    const { email } = req.body;

    // check if user already exist
    const checkUserPresent = await User.findOne({ email });

    // if user already exits then return res
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    // generate otp

    var otp = optGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP Generate", otp);

    // check otp unique or not
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = optGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // create an entery for OTP
    const otpBody = await OTP.create({ otpPayload });
    console.log(otpBody);

    // return res
    return res.status(200).json({
      success: true,
      message: "otp generated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "error while creating OTP",
    });
  }
};
