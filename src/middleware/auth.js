const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')


const userAuthentication = async function(req, res, next){

    try {

        const token = req.headers["authorization"]
        const userId = req.params.userId
        console.log(token)

        if (!token) {
        return res.status(400).send({ status: false, message: `Token Not Found` })}
        let user = await userModel.findById(userId)

        let decoded = jwt.verify(token, 'ProjectNo-5') 
            
            if (user["_id"] != decoded.userId) {
              return res.status(403).send({
                status: false,
                message: "you can only use your userId to create a new book",
              });
            }
        
    
         if (!decoded) {return res.status(401).send({ status: false, message: `Invalid Token` })}

        //req.userId = decodeToken.userId

        next()


    } catch (err) {

        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.userAuthentication  = userAuthentication