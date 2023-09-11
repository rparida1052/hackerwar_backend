const Industry = require("../models/industrySchema");
const WasteProducts = require("../models/wasteProductsSchema");

exports.addWasteProducts = async (req, res) => {
  try {
    const { industry, wasteName, wasteQuantity, wasteType } = req.body;
    if (!industry) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Valid industryName",
      });
    } if(!wasteName){
        return res.status(400).json({
            success: false,
            message: "Please Enter Valid wasteName",
          });
    }
     if(!wasteQuantity){
        return res.status(400).json({
            success: false,
            message: "Please Enter Valid wasteQuantity",
          });
    }
     if(!wasteType){
        return res.status(400).json({
            success: false,
            message: "Please Enter Valid wasteType",
          });
    }
    const wasteproducts = new WasteProducts({
        industry,wasteName,wasteType,wasteQuantity
    })

    const saveWasteProducts = await wasteproducts.save();
    const updatedindustryDetails = await Industry.findByIdAndUpdate(industry,{$push:{wasteProducts:saveWasteProducts._id}},{new:true}).populate("wasteProducts").exec();
    updatedindustryDetails.industryPassword = undefined
    res.status(200).json({
        success:true,
        message:"Waste details updated successfully",
        industry_Waste_Details : updatedindustryDetails
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Internal Error occured in server",
        error: error,
      });
  }
};


exports.deleteWasteProducts = async(req,res) =>{
    try{
        const {industry,id} = req.body;
        
    if(!id){
        return res.status(400).json({
            success: false,
            message: "Please Enter Valid waste details",
          });
    }
    //finding the waste
    const waste = await WasteProducts.findById({_id:id})
    if(!waste){
        return res.status(400).json({
            success: false,
            message: "No waste found",
          });
    }
    //delete from waste table
    const deletedWaste = await WasteProducts.findByIdAndDelete({Industry:industry,_id:id}).exec();

    //update from industry table

        const updateIndustry = await Industry.findByIdAndUpdate(industry,{
            $pull:{
                wasteProducts:id
            },
        })
    res.status(200).json({
        success:true,
        message:"Waste details deleted successfully",
    })
    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }

}