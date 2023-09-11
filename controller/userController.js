const User = require("../models/userSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUpUser = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    const existinguser = await User.findOne({ email }).exec();

    if (existinguser) {
      return res.status(400).json({
        success: false,
        message: "User Already exist",
      });
    }

    //hashing the password
    let hassedPassword;
    try {
      hassedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      res.status(400).json({
        success: false,
        message: "password doees not hshed",
      });
    }
    const user = new User({
      userName,
      email,
      password:hassedPassword,
    });
    if (!userName) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid name",
      });
    } else if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid email",
      });
    } else if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid password",
      });
    } else {
      if (password.length < 5) {
        return res.status(400).json({
          success: false,
          message: "Please Enter a password more than 5",
        });
      }
      const saveUser = await user.save();
      return res.status(200).json({
        success: true,
        message: "User created successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Error occured in server",
      error: error,
    });
  }
};


exports.userLogin = async (req,res) =>{

  try{

    const {email,password} = req.body;

     if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid email",
      });
    } else if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid password",
      });
    } else {

      const existingUser = await User.findOne({email});
      if(!existingUser){
        return res.status(400).json({
          success: false,
          message: "No user found",
        });
      }
      const payload  = {
        email:existingUser.email,
        userName:existingUser.userName,
        id:existingUser._id
      }

      if(await bcrypt.compare(password,existingUser.password) ){
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
          expiresIn:"1h",
        });
        //!error may occure here

        existingUser.token = token;
        existingUser.password = undefined;

        const cookieOptions = {
          expires:new Date(Date.now()+1*24*60*60*1000),
          httpOnly:true
        }
        res.cookie("token", token, cookieOptions).status(200).json({
          success:true,
          token,
          user:existingUser,
          messge:"user login successfully"
       })

      }else{
        return res.status(400).json({
          success: false,
          message: "Password did not match",
        });
      }

    }
    
  }catch(error){
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Error occured in server",
      error: error,
    });
  }

}