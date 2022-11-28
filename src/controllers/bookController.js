const bookModel = require("../models/bookmodel")
const mongoose = require("mongoose")
const userModel = require("../models/userModel");
const {isEmpty, isValidTitle, isValidPhone, isValidMail, isValidFullName, isValidPassword} = require("../validation/validation")

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "String" && typeof value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function (objectId) {
    //     return /^[0-9a-fA-F]{24}$/.test(objectId)
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const createBook = async function (req, res) {
    try {
        let data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, reviews } = data

        // IF BODY IS EMPTY.------------------------------------------
         if(Object.keys(data).length==0)
         return res.status(400).send({status:false, message:"Please provide data in request body"})
    

         // IF VALUES ARE NOT IN BODY.--------------------------------
         if(!title)
         return res.status(400).send({stauts:false, message:"title is required"})

         if(!excerpt)
         return res.status(400).send({stauts:false, message:"excerpt is required"})

         if(!userId)
         return res.status(400).send({stauts:false, message:"userId is required"})

         if(!ISBN)
         return res.status(400).send({stauts:false, message:"ISBN is required"})

         if(!category)
         return res.status(400).send({stauts:false, message:"category is required"})

         if(!subcategory)
         return res.status(400).send({stauts:false, message:"subcategory is required"})

        

         // IF VALUES ARE EMPTY BY INFO.-------------------------------------
         if(!(isEmpty(title)))
         return res.status(400).send({stauts:false, message:"title is empty"})

         if(!(isEmpty(excerpt)))
         return res.status(400).send({stauts:false, message:"excerpt is empty"})

         if(!(isEmpty(ISBN)))
         return res.status(400).send({stauts:false, message:"ISBN is empty"})

         if(!(isEmpty(userId)))
         return res.status(400).send({stauts:false, message:"userId is empty"})

         if(!(isEmpty(category)))
         return res.status(400).send({stauts:false, message:"category is empty"})

         if(!(isEmpty(subcategory)))
         return res.status(400).send({stauts:false, message:"subcategory is empty"})
     
        const findbook = await bookModel.find({title:title})
        if(findbook)
        return res.status(400).send({status:false,message:"Title is registered please pass new title"})

        const createdBook = await booksModel.create(data)
        return res.status(201).send({ status: true, message: "Book created Successfully", data: createdBook })

    }
        catch (err) {
            return res.status(500).send({ status: false, message: err.message })
        }
    }

    

const allBooks = async function (req, res) {

    try {

        const { userId, category, subcategory } = req.query;

        let findObj = {
            isDeleted: false,
        }
        if (userId) {
            findObj["userId"] = userId
        }
        if (category) {
            findObj["category"] = category
        }
        if (subcategory) {
            findObj["subcategory"] = subcategory
        }
        
        let data = await bookModel.find(findObj).select({ _id: 1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1 });
        
       if (data.reviews > 0) {
        data.reviewsData = data.reviews;
       }

        if (data.length <= 0) return res.status(404).send({ Status: false, message: 'No Data Found' })

        res.status(200).send({ Status: true, message: "Book List", data: data })

    }   catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = {allBooks , createBook};

//nst jwt = require('jsonwebtoken')

const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken')

const login = async function (req, res) {
    try {
        const mail = req.body.email
        const pass = req.body.password
        const data = req.body
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, message: "No input provided" })

        if (!isValid(mail)) { return res.status(400).send({ status: false, message: "Email is required" }) }

        if (!isRightFormatemail(mail)) { return res.status(400).send({ status: false, message: 'Please provide a valid email' }) }

        if (!isValid(pass)) { return res.status(400).send({ status: false, message: "Password is required" }) }

        if (pass.length < 8 || pass.length > 15) { return res.status(400).send({ status: false, message: 'Password should be of minimum 8 characters & maximum 15 characters' }) }
        //validation ends

        const mailMatch = await userModel.findOne({ email: mail })
        if (!mailMatch) return res.status(400).send({ status: false, message: "Email is incorrect" })

        const passMatch = await userModel.findOne({ password: pass })
        if (!passMatch) return res.status(400).send({ status: false, message: "Password is incorrect" })

        const token = jwt.sign({
            userId: mailMatch._id.toString(), iat: new Date().getTime() / 1000,
        }, "Secret-Key", { expiresIn: "30m" });

        res.setHeader("x-api-key", "token");
        return res.status(200).send({ status: true, message: "You are successfully logged in", token })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}


module.exports.login = login;