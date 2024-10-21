const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


//NOTE - reset password Token

exports.resetPasswordToken = async (req,res) => {
     
    try{
        //get email from req body
        const email = req.body;

        //check user for this email , email validation
        const user = await  User.findOne({email:email});
        if(!user){
            return res.status(404).json(
                {
                    success:false,
                    message:"User not found",
            });
        }


        //generate token 
        const token = crypto.randomUUID();  //generate random token


        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email:email},
                                    {
                                    token:token,
                                    resetPasswordExpires: Date.now() + 5*60*1000,
                                    },
                                    {new:true},
        );

        //create url
        const url = `https://localhost:3000/update-password/${token}`;

        //send mail containig  the url
        await mailSender(email, "password reset link", `password reset link: ${url}`);

        //retutn response
        return res.status(201).json({
            success:true,
            message:"password reset link sent to your email",
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reset pwd mail",
        });
    }

}


//reset password

exports.resetPassword = async (req,res) => {
    
    try{
        //fetch data
        const {password , confirmPassword , token} = req.body;

        //valdiation
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password not matching",
            });
        }

        //get user details from db using token
        const userDetails = await User.findOne({token:token});

        //if no entry - invalid token
        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:"Invalid Token",
            });
        }

        //token time expires
        if(userDetails.resetPasswordExpires < Date.now() ){
            return res.status(401).json({
                success:false,
                message:"Token expired",
            });
        }

        //hask pwd
        const hashedPassword = await bcrypt.hash(password, 10);

        //update pwd
        await User.findOneAndUpdate({token:token},
                                    {password:hashedPassword},
                                    {new:true},
        );

        //res return
        return ress.status(200).json({
            success:true,
            message:"Password reset successfully",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
        });
    }
}







//NOTE -  why we ha feed token in user 
//NOTE - because when we nees to update new password then we need token to fetch user