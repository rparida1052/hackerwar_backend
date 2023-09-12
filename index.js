const express = require('express');
const app = express();

const routes = require('./routes/routes')
const dbConfig = require('./config/databaseConfig')
const cloudinary = require('./config/cloudinaryConfig');
const fileUpload = require('express-fileupload');
require('dotenv').config();
app.use(express.json());


app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/temp/"
}))
app.use("/api/v1",routes)

app.get('/',(req,res)=>{
    res.send("<h1>Welcome to Hackerwar 4.0</h1>")
})
const port = process.env.PORT || 4000;
app.listen(port,()=>{
    console.log(`App is listening on port${port}`)
})
dbConfig();
cloudinary.cloudinaryConnect();