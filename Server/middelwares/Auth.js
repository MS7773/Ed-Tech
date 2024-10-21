const jwt = require("jsonwebtoken");
require( "dotenv").config();
const User = require('../models/User');


//NOTE - auth

exports.auth= async (req, res, next) => {
    try{
    //extract token
    const token =req.cookies.token
                || req.body.token
                || req.header("Authorisation" ).replace("Bearer ","");

    // if token missing, then return response
    if(!token) {
        return res.status(401).json({
            success: false,
            message: "TOken is missing" ,
        })
    }

    //verify the token
    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        console.log(decode);
        req.user=decode;
    }
    catch(error){
        //verification issues
        return res.status(401).json({
            success:false,
            message:"Invalid Token",
        });
    }
    }        

    catch(error){
        return res.status(401).json({
            success:false,
            message:"Something Went Wrong While Validating The Token",
        });
    }

}    

//NOTE - Is Students

exports.isStudent =async (req,res,next)=>{
    
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                mesage:"This is a protected route for students only",
            });
        }
        next();
    }

    catch(error){
        return res.status(401).json({
            success:false,
            message:"User Role Can not be verified , Please try again",
        });
    }
}


//NOTE - Is Instructor

exports.isInstructor =async (req,res,next)=>{
    
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                mesage:"This is a protected route for Instructor only",
            });
        }
        next();
    }

    catch(error){
        return res.status(401).json({
            success:false,
            message:"User Role Can not be verified , Please try again",
        });
    }
}


//NOTE - Is Admin

exports.isAdmin =async (req,res,next)=>{
    
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                mesage:"This is a protected route for Admin only",
            });
        }
        next();
    }

    catch(error){
        return res.status(401).json({
            success:false,
            message:"User Role Can not be verified , Please try again",
        });
    }
}