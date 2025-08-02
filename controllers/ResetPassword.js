 const User = require("../models/User");
 const mailSender = require("../utils/mailSender");


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