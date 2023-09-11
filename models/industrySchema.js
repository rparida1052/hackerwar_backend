const mongoose = require("mongoose");

const industrySchema = new mongoose.Schema({
  industryName: {
    type: String,
    required: true,
  },
  industryEmail: {
    type: String,
    required:true,
    unique:true
  },
  industry_Id: {
    type: String,
    required: true,
  },
  industryPassword: {
    type: String,
    required: true,
  },
  industryImage: {
    type: String,
  },
  location: {
    type: Number,
  },
  type_of_waste: {
    type: String,
  },
  wasteProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WasteProducts",
    },
  ],
});

module.exports = mongoose.model("Industry", industrySchema);
