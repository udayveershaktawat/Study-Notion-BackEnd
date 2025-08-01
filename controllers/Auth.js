const User = require("../models/User");
const OTP = require("../models/OTP");
const optGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require(dotenv).config();

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
// sign up controller

exports.signUp = async(req,res)=>{
  try{
    // data fetch

    const { firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp} = req.body;

    // validate
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
      return res.status(403).json({
        success:false,
        message:"all fields are required"
      })
    }

    // 2 password match

    if(password !== confirmPassword){
      return res.status(400).json({
        success:false,
        message:"password and confirm password value does not match, please fill correct password"
      })
    }

    // check user ALredy exist or not

    const existingUser =  await  User.findOne({email});
    if(existingUser){
      return res.status(400).json({
        success:false,
        message:"User already exist"
      })
    }
    // find most recent OTP stored for the user
    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);
    // validate otp
    if(recentOtp.length == 0){
      // otp not found
      return res.status(400).json({
        success:false,
        message:"otp not found"
      })

    }
    else if(otp !== recentOtp.otp){
      // invalid otp
      return res.status(400).json({
        success:false,
        message:"invalid otp"
      })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password,10);

    // create entry in db
    const profileDetails = await Profile.create({
      gender:null,
      dateOfBirth:null,
      contactNumber:null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password:hashedPassword,
      accountType,
      additionalDetails:profileDetails._id,
      image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    });


    // return res
    return res.status(200).json({
      success:true,
      message:"user is register successfully"
    })



  }
  catch(error){
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"user can not be register"

    })

  }
}


// login

exports.login = async(req,res)=>{
  try{
    // get data from req body
    const {email,password} = req.body;

    // validation
    if(!email || !password){
      return res.status(403).json({
        success:false,
        message:"all fields are required"
      })
    }
    // user check exist or not
    const user = await User.findOne({email}).populate("additionalDetails").exec();
    if(!user){
      return res.status(401).json({
        success:false,
        message:"user is not register please signup"
      })
    }
    // generate token jwt after match password

    if( await bcrypt.compare(password , user.password)){
      const payload = {
        email :user.email,
        id : user._id,
        role:user.role,
      }
      const token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"2h"
      }); 

      user.token = token;
      user.password = undefined;

      // create cookie and send response
    const options = {
          expiresIn:new Date(Date.now() + 3*24*60*60*1000),
          httpOnly:true
    }

    res.cookie("token",token,options).status(200).json({
      success:true,
      message:"logged in successfully",
      token,
      user,

    })

    }
    else {
      return res.status(401).json({
        success:false,
        message:"password is in correct"
      })
    }

    
  }
  catch(error){
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"login failer , please try again"
    })

  }
}


// reset password

exports.changePassword = async(req,res)=>{
  try{

  }
  catch(error){
    
  }
}
