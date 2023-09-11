const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    intrestedItems:{
        type:String,
    },
    

})

module.exports = mongoose.model("User",userSchema);