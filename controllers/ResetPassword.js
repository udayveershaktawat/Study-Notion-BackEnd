 const User = require("../models/User");
 const mailSender = require("../utils/mailSender");
 const bcrypt = require("bcrypt");


//  reset password token
exports.resetPasswordToken = async(req,res)=>{
    try{
        // get email for req body
        const {email} = req.body.email;
        // validation
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"your email is not register with us"
            });
        }
        // generate token
        const token = crypto.randomUUID();
        // update user by adding token and expires time
        const updatedDetails = await User.findByIdAndUpdate({email:email},
                                                            {
                                                                token:token,
                                                                resetPasswordExpires:Date.now() + 5*60*1000,
                                                            },
                                                            {new:true}
        )
        // create url
        const url = `http://localhost:3000/update-password/${token}`
        // send mail containing url
        await mailSender(email,
                        "password reset link",
                        `password reset Link ${url}`,
        )
        // return res

        return res.status(200).json({
            success:true,
            message:"email send successfully,please check your email and change pwd"
        })

    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"something went wrong while creating reset pwd email"
        })

    }
}

// reset password
exports.resetPassword = async(req,res)=>{
    try{
        // data fetch
        const {password,confirmPassword,token} = req.body;
        // validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"password not matching"
            })
        }
        // get userdetails from db using token
        const userDetails = await User.findOne({token:token});
        // if no entry - invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"token is invalid"
            })
        }
        // token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"token is expired,please re generate your token"
            })
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password,10);
        // password update
        await User.findByIdAndUpdate({token:token},
                                     {password:hashedPassword},
                                     {new:true}
        );

        // return res
        return res.status(200).json({
            success:true,
            message:"password reset successfully"
        })

    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"something went wrong while reseting password"
        })

    }
}