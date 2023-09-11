const express = require('express');
const router  = express.Router();

const {signUpUser,userLogin} =  require('../controller/userController');
const {industrySignUp,industryLogin}  = require('../controller/industryController');
const {addWasteProducts,deleteWasteProducts} = require('../controller/wasteProductsController')
router.post("/userSignup",signUpUser)
router.post("/userLogin",userLogin)
router.post("/industrySignUp",industrySignUp)
router.post("/industryLogin",industryLogin)
router.post("/addWasteProducts",addWasteProducts)
router.delete("/deleteWasteProducts",deleteWasteProducts)


module.exports = router;