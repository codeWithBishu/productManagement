const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const auth = require('../middleware/auth')
const cartController=require('../controllers/cartControllers')

/*_____________________-----===> API FOR USER <====-----______________________________*/ 

router.post("/register", userController.createUser)
router.post("/login",userController.userLogin)
router.get('/user/:userId/profile',auth.userAuthentication, userController.getUserDetails)
router.put('/user/:userId/profile',auth.userAuthentication, userController.updateUserDetails)

/**______________________----==> PRODUCT API <===---____________________________________ */

router.post("/products", productController.createProduct)
router.get('/products',productController.getAllProducts)
router.get('/products/:productId',productController.getProductById)
router.put('/products/:productId',productController.updateProduct)
router.delete('/products/:productId',productController.deleteProduct)

/**_____________________________________________________________________________________ */
router.post('/users/:userId/cart',auth.userAuthentication, cartController.createCart)
router.put('/users/:userId/cart',cartController.updateCart)
router.get('/users/:userId/cart', auth.userAuthentication, cartController.getCartData)
router.delete('/users/:userId/cart', auth.userAuthentication, cartController.deleteCart)




module.exports = router;