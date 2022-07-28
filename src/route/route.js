const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const auth = require('../middleware/auth')

router.post("/register", userController.createUser)

router.post("/login",userController.userLogin)

router.get("/user/:userId/profile",auth.userAuthentication, userController.getUserDetails)

router.put('/user/:userId/profile',auth.userAuthentication, userController.updateUserDetails)

router.post("/product", productController.createProduct)

router.get("/products/:productId", productController.getProductById)




module.exports = router;