const product = require('../models/productModel')

const {uploadFile} = require('../validator/validator')

const body = (ele) => {
    if (Object.keys(ele).length) return;
    return `Please send some valid data in request body`;
};

const check = (ele) => {
    if (ele == undefined) { return `is missing` }
    if (typeof ele != "string") { return `should must be a string` }
    // ele = ele.trim();
    if (!ele.length) { return `isn't valid` }
    if (ele.match("  ")) return `can't have more than one consecutive spaces'`;
};

const name = (ele) => {
    let regEx = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
    return regEx.test(ele);
  };
  const checkNumber = (ele) => {
    if (ele == undefined) { return `is missing` }
    if (typeof ele != "number") { return `should must be a Number` }
    ele = ele.trim();
    if (!ele.length) { return `isn't valid` }
};



const createProduct = async function(req,res){

    try {
        let files=req.files
        
        let ProductImage = await uploadFile(files[0]);
  
  
          let data = req.body;
          let message;
          if ((message = body(data))) { return res.status(400).send({ status: false, message: `${message}` }) };

          let { title, description, price, currencyId, style, availableSizes, installments } = data
          
          if((message = check(title))) {return res.status(400).send({status:false,message:`title ${message}`})}
          if((!name(title))) {return res.status(400).send({status:false,message:"invalid title"})}

          let duplicateTitle = await product.findOne({ title })
          if(duplicateTitle) return res.status(400).send({status:false,message:"title is already exists"})
          
          if((message = check(description))) {return res.status(400).send({status:false,message:`description ${message}`})}
          if((!name(description))) {return res.status(400).send({status:false,message:"invalid description"})}

          if((message = checkNumber(price))) {return res.status(400).send({status:false,message:`price ${message}`})}

          if((message = check(currencyId))) {return res.status(400).send({status:false,message:`currencyId ${message}`})}

          if(currencyId != "INR") return res.status(400).send({status:false, message: "it only take INR as currencyId"})

          if(currencyFormat == undefined) return res.status(400).send({status:false, message: "currency format is missing"})

          if( (typeof (currencyFormat != "string")) && (currencyFormat != "₹")) return res.status(400).send({status:false, message: "it only take '₹' as currencyFormat"})
          
          if((message = check(style))) {return res.status(400).send({status:false,message:`style ${message}`})}
          if((!name(style))) {return res.status(400).send({status:false,message:"invalid style"})}
          
          let arr = ["S","XS","M","X","L","XXL","XL"]
          if (!arr.includes(availableSizes)) {return res.status(400).send({status: false,message: `availableSizes is required and can only have these values ${arr}`})}

          if((message = checkNumber(installments))) {return res.status(400).send({status: false,message: `installments ${message}`})}

          data.productImage = ProductImage

          let productData = await product.create(data)
          res.status(201).send({status:true, message:"product created successfully", data: productData})



        } catch (err) {
            res.status(500).send({ msg: err.message });
        }

}



module.exports.createProduct = createProduct