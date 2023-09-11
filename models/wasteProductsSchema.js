const mongoose = require('mongoose');

const wasteProductSchema = new mongoose.Schema({
    industryName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Industry"
    },
    wasteName:{
        type:String,
        required:true
    },
    wasteImage:{
        type:String,
    },
    wasteQuantity:{
        type:Number,
        required:true,
    },
    wasteType:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("WasteProducts",wasteProductSchema);