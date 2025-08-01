const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();


exports.auth = async(req,res,next)=>{
    try{
        // extract token

        const token = req.cookie.token || req.body.token || req.header("Authorisation").replace("bearer ","");
        // if token  missing , then return res
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing"
            })
        }
        // verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;


        }
        catch(error){
            // verification issue
            return res.status(401).json({
                success:false,
                message:"invalid token"
            })

        }
        next();


    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"something went wrong  while validating the token",
        })

    }
}

// isstudent
exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for student only"
            });
        }
        next();


    }
    catch(error){
        return res.status(500).json({
            success:fasle,
            message:"User role can not be verified , please try again"
        })

    }
}
// isInstructor
exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Instructor only"
            });
        }
        next();


    }
    catch(error){
        return res.status(500).json({
            success:fasle,
            message:"User role can not be verified , please try again"
        })

    }
}
// isAdmin
exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Admin only"
            });
        }
        next();


    }
    catch(error){
        return res.status(500).json({
            success:fasle,
            message:"User role can not be verified , please try again"
        })

    }
}
