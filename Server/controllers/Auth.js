const User=require('../models/User');
const OTP=require('../models/OTP');
const otpGenerator=require('otp-generator');
const bcrypt= require('bcrypt');
const jwt=require('jsonwebtoken');
require("dotenv").config();


//NOTE - Send OTP
exports.sndOTP=async (req,res)=>{

    try{
        //fetch email from req body
        const {email}=req.body;

        //check if user already exists
        const checkUserPresent= await User.findOne({email});

        //if user already exists written a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User Already Registered',
            })
        }

        //generate OTP
        var otp= otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });

        //check unique otp  or not
        var result = await OTP.findOne({otp:otp});

        while(result){
            otp= otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp});
        }
        const otpPayload = {email,otp};  //as crearted at has default so we given 2 values only

        //craete an entry for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return res successfully
        res.status(200).json({
            success:true,
            message:'OTP Send Successfully',
            otp,
        })
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            status:false,
            message:error.message,
        })
    }
}


//NOTE - SignUp
exports.signUp = async (req,res)=>{

   try{
        //data fetch from req body
        const {
            firstName,
            lastName,
            email,      
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;   

        //validate data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
            success: false,
            message: "All fields are required",    
            });
        }

        //match both password
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password do not match ,Please Try Again ",
            });
            
        }

        //check user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User Already Registered..",
            });
        }

        //find most recent otp stored for the user
        const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);


        //validate otp
        if(recentOtp.length==0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:"Otp Not Found",
            });
        }

        else if(otp !== recentOtp){
            // Invalid otp
            return res.status(400).json({
                success:false,
                message:"Invalid Otp",
            });
        }


        //hash password
        const hashedPassword = await bcrypt.hash(password,10); 


        //create entry in db
        const profileDetail = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetail:profileDetail,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        //return res
        return res.status(200).json({
            success:true,
            message:"User Registered Sucessfully",
            user,
        });
   }

   catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"User Can not be registered , Please try Again", 
    })
   }
}


//NOTE - Login

exports.login= async (req,res) => {

    try{

        //get data from req body
        const {email,password} = req.body;

        //validation data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All Feilds Are Required , Please Try Again",
            });
        }

        //user check exists or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User Is Not Registered , please signup first",
            });
        }

        //generate JWT , after password checking
        if(await bcrypt.compare(password , user.password)){

            const payload={
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
    
            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn:"2h",
            });
            user.token=token;
            user.password=undefined;

             //create cookie and send respose
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000), //it shows that 3 days 
                httpOnly:true, 
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in sucessfully",
            });

        }
        else{
            return res.satus(401).json({
                success:false,
                message:"Password is incorrect",
            });
        }
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure Please try again",
        });
    }
}


//NOTE - Change Password

exports.changePassword = async (req,res) => {

    //get data from req body

    //get old password , new password , confirm new pasword

    //vaidaiton


    //update password in DB

    //send mail - password updated

    //return response
}