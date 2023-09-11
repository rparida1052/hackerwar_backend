const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = ()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("Database connected successfully")
    }).catch((error)=>{
        console.log("Error occured");
        console.error(error);
        process.exit(1);
    })
}

module.exports = connectDb;