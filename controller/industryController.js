const Industry = require("../models/industrySchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.industrySignUp = async (req, res) => {
  try {
    const {
      industryName,
      industryEmail,
      industry_Id,
      industryPassword,
      type_of_waste,
      wasteProducts,
    } = req.body;

    console.log(industryName, industryPassword);
    const existingIndusrty = await Industry.findOne({ industry_Id }).exec();

    if (existingIndusrty) {
      return res.status(400).json({
        success: false,
        message: "Industry Already exist",
      });
    }

    //hashing the password
    let hassedPassword;
    try {
      hassedPassword = await bcrypt.hash(industryPassword, 10);
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        message: "password doees not hashed,Please retry",
      });
    }
    const industry = new Industry({
      industryName,
      industry_Id,
      industryEmail,
      industryPassword: hassedPassword,
      type_of_waste,
      wasteProducts,
    });

    if (!industryName) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid industryName",
      });
    } else if (!industryEmail) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid industryEmail",
      });
    } else if (!industry_Id) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid industry_Id",
      });
    } else if (!industryPassword) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid Industry Password",
      });
    } else {
      if (industryPassword.length < 5) {
        return res.status(400).json({
          success: false,
          message: "Please Enter a password more than 5 length",
        });
      }

      const saveIndustry = await industry.save();
      return res.status(200).json({
        success: true,
        message: "Industry created successfully",
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

exports.industryLogin = async (req, res) => {
  try {
    const { industryEmail, industryPassword } = req.body;
    if (!industryEmail) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid Email",
      });
    }
    if (!industryPassword) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid password",
      });
    }
    const existingIndustry = await Industry.findOne({ industryEmail });
    if (!existingIndustry) {
      return res.status(400).json({
        sucess: false,
        message: "No industry found with this email",
      });
    }

    const payload = {
      industryEmail: existingIndustry.industryEmail,
      industry_Id: existingIndustry.industry_Id,
      industryName: existingIndustry.industryName,
    };
    if (bcrypt.compare(industryPassword, existingIndustry.industryPassword)) {
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      //sending token to response
      existingIndustry.token = token;
      existingIndustry.industryPassword = undefined;
      const cookieOptions = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, cookieOptions).status(200).json({
        success: true,
        token,
        user: existingIndustry,
        messge: "Industry login successfully",
      });
    } else {
      return res.status(400).json({
        sucess: false,
        message: "Password does not match",
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
