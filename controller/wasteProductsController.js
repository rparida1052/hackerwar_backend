const Industry = require("../models/industrySchema");
const WasteProducts = require("../models/wasteProductsSchema");
const cloudinary = require('cloudinary');

function isFileSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  options.resource_type = "auto";
  if (quality) {
    options.quality = quality;
  }
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}
exports.addWasteProducts = async (req, res) => {
  try {
    const { industry, wasteName, wasteQuantity, wasteType } = req.body;
    const file = req.files.imageFile;
    console.log(industry,wasteName,wasteQuantity);
    console.log("file -->",file)

    

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid file",
      });
    }
    if (!industry) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid industryName",
      });
    }
    if (!wasteName) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid wasteName",
      });
    }
    if (!wasteQuantity) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid wasteQuantity",
      });
    }
    if (!wasteType) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid wasteType",
      });
    }

    const supportedTypes = ["jpg", "png", "jpeg"];
    const fileExtension = file.name.split(".")[1].toLowerCase();

    if (!isFileSupported(fileExtension, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    const response = await uploadFileToCloudinary(file, "hackerwar");

    const wasteproducts = new WasteProducts({
      industry,
      wasteName,
      wasteType,
      wasteQuantity,
      wasteImage: response.secure_url,
    });

    const saveWasteProducts = await wasteproducts.save();
    const updatedindustryDetails = await Industry.findByIdAndUpdate(
      industry,
      { $push: { wasteProducts: saveWasteProducts._id } },
      { new: true }
    )
      .populate("wasteProducts")
      .exec();
      console.log(updatedindustryDetails)
    updatedindustryDetails.industryPassword = undefined;
    res.status(200).json({
      success: true,
      message: "Waste details updated successfully",
      industry_Waste_Details: updatedindustryDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Error occured in server",
      error: error,
    });
  }
};

exports.deleteWasteProducts = async (req, res) => {
  try {
    const { industry, id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid waste details",
      });
    }
    //finding the waste
    const waste = await WasteProducts.findById({ _id: id });
    if (!waste) {
      return res.status(400).json({
        success: false,
        message: "No waste found",
      });
    }
    //delete from waste table
    const deletedWaste = await WasteProducts.findByIdAndDelete({
      Industry: industry,
      _id: id,
    }).exec();

    //update from industry table

    const updateIndustry = await Industry.findByIdAndUpdate(industry, {
      $pull: {
        wasteProducts: id,
      },
    });
    res.status(200).json({
      success: true,
      message: "Waste details deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
