const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const cartModel = require('../models/cartModel')
const { isValidRequestBody,isValidObjectId,isValid } = require('../validator/validator')

const validQuantity = function isInteger(value) {
    if (value < 1) return false
    if (isNaN(Number(value))) return false
    if (value % 1 == 0) return true
}

const createCart = async function (req, res) {
    try {
        const userId = req.params.userId
        const requestBody = req.body;
        const { quantity, productId } = requestBody
        let userIdFromToken = req.userId;

        
        if (!isValidRequestBody(requestBody)) {return res.status(400).send({ status: false, message: "Please provide valid request body" })}

        if (!isValidObjectId(userId)) {return res.status(400).send({ status: false, message: "Please provide valid User Id" })}

        if (!isValidObjectId(productId) || !isValid(productId)) {return res.status(400).send({ status: false, message: "Please provide valid Product Id" })}

        if (!isValid(quantity) || !validQuantity(quantity)) {
            return res.status(400).send({ status: false, message: "Please provide valid quantity & it must be greater than zero." })
        }
     

        const findUser = await userModel.findById({ _id: userId })
        if (!findUser) {return res.status(400).send({ status: false, message: `User doesn't exist by ${userId}` })}

        
        if (findUser._id.toString() != userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! User's info doesn't match` });
        }

        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!findProduct) {
            return res.status(400).send({ status: false, message: `Product doesn't exist by ${productId}` })
        }

        const findCartOfUser = await cartModel.findOne({ userId: userId })

        if (!findCartOfUser) {

            
            let cartData = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: quantity,
                }],
                totalPrice: findProduct.price * quantity,
                totalItems: 1
            }

            const createCart = await cartModel.create(cartData)
            return res.status(201).send({ status: true, message: `Cart created successfully`, data: createCart })
        }

        if (findCartOfUser) {

            
            let price = findCartOfUser.totalPrice + (req.body.quantity * findProduct.price)
            let itemsArr = findCartOfUser.items

            //updating quantity.
            for (i in itemsArr) {
                if (itemsArr[i].productId.toString() === productId) {
                    itemsArr[i].quantity += quantity

                    let updatedCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }

                    let responseData = await cartModel.findOneAndUpdate({ _id: findCartOfUser._id }, updatedCart, { new: true })

                    return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })
                }
            }
            itemsArr.push({ productId: productId, quantity: quantity })

            let updatedCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }
            let responseData = await cartModel.findOneAndUpdate({ _id: findCartOfUser._id }, updatedCart, { new: true })

            return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })
        }
    } catch (err) {
        res.status(500).send({ status: false, data: err.message });
    }
}





const getCartData = async function (req, res) {
    try {
        const userId = req.params.userId;
        let userIdFromToken = req.userId

        if (!isValidObjectId(userId)) {return res.status(400).send({ status: false, message: "Invalid userId in path params." })}

        const userFind = await userModel.findById({ _id: userId })
        if (!userFind) {return res.status(400).send({ status: false, message: `User does not exists by this userId ` })}

        if (userFind._id.toString() != userIdFromToken) {return res.status(401).send({ status: false, message: `authentication fail ` })}

        const cartFind = await cartModel.findOne({ userId: userId })

        if (!cartFind) {return res.status(400).send({ status: false, message: `Cart does not exists by this userId ` })}

        return res.status(200).send({ status: true, message: "Successfully get the cart data.", data: cartFind })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const deleteCart = async function (req, res) {
    try {
        const userId = req.params.userId;
        let userIdFromToken = req.userId

        if (!isValidObjectId(userId)) {return res.status(400).send({ status: false, message: "Invalid userId in params." })}
        
        const userFind = await userModel.findOne({ _id: userId })
        if (!userFind) {return res.status(400).send({ status: false, message: `User does not exists by this userId ` })}

        if (userFind._id.toString() != userIdFromToken) {return res.status(401).send({ status: false, message: `authentication fail` });
}

        const cartFind = await cartModel.findOne({ userId: userId })
        if (!cartFind) {return res.status(400).send({ status: false, message: `Cart does not exists by this userId ` })}

        await cartModel.findOneAndUpdate({ userId: userId }, {$set: {items: [],totalPrice: 0,totalItems: 0}},{new:true})
        
        return res.status(204).send({ status: true, message: "Cart successfully deleted" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.createCart = createCart
module.exports.getCartData = getCartData
module.exports.deleteCart = deleteCart