const userModel = require('../models/userModel')
const validation = require('../validation/validation')
const jwt = require("jsonwebtoken")

const { isEmpty, isValidTitle, isValidPhone, isValidMail, isValidFullName, isValidPassword, isValidPincode } = validation

const createUser = async function (req, res) {
    try {

        const data = req.body
        const { title, name, phone, email, password, address } = data

        /*------------------------Checking body is empty or not----------------------------------*/
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please provide data in request body" }) }

        /*------------------------Checking fileds are present or not-----------------------------*/
        if (!title) { return res.status(400).send({ status: false, message: "title is required" }) }
        if (!name) { return res.status(400).send({ status: false, message: "name is required" }) }
        if (!phone) { return res.status(400).send({ status: false, message: "phone is required" }) }
        if (!email) { return res.status(400).send({ status: false, message: "email is required" }) }
        if (!password) { return res.status(400).send({ status: false, message: "password is required" }) }

        /*-------------------Checking fileds values are empty or not-----------------------------*/
        if (!(isEmpty(title))) { return res.status(400).send({ status: false, message: "title is empty" }) }
        if (!(isEmpty(name))) { return res.status(400).send({ status: false, message: "name is empty" }) }
        if (!(isEmpty(phone))) { return res.status(400).send({ status: false, message: "phone is empty" }) }
        if (!(isEmpty(email))) { return res.status(400).send({ status: false, message: "email is empty" }) }
        if (!(isEmpty(password))) { return res.status(400).send({ status: false, message: "password is empty" }) }

        /*-------------------Checking mail or pass. is unique or not---------------------------*/
        const duplicateEmail = await userModel.findOne({ email: email })
        if (duplicateEmail) { return res.status(400).send({ status: false, message: "email already exits" }) }

        const duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) { return res.status(400).send({ status: false, message: "phone already exits" }) }

        /*------------------------------- Validation(Regex)  -----------------------------------*/
        if (!(isValidTitle(title))) { return res.status(400).send({ status: false, message: "Please enter correct title ex: Mr, Mrs, Miss" }) }
        if (!(isValidPhone(phone))) { return res.status(400).send({ status: false, message: "Invalid phone number" }) }
        if (!(isValidMail(email))) { return res.status(400).send({ status: false, message: "Invalid email Id" }) }
        if (!(isValidFullName(name))) { return res.status(400).send({ status: false, message: "Please provide valid full name" }) }
        if (!(isValidPassword(password))) { return res.status(400).send({ status: false, message: "Invalid password. Please provide password with one special character for ex: (!@#$%^&*) and length should be between 8 and 15 characters." }) }

        /*------------------Checking address fileds present or not/Validation------------------*/
        if (address) {
            if (!(isEmpty(address.pincode))) { return res.status(400).send({ status: false, message: "pincode is Empty" }) }
            if (address.pincode) {
                if (!(isValidPincode(address.pincode))) { return res.status(400).send({ status: false, message: "Invalid pincode" }) }
            }
        }
        if (address) {
            if (!(isEmpty(address.city))) { return res.status(400).send({ status: false, message: "city is Empty" }) }
            if (address.city) {
                if (!(isValidFullName(address.city))) { return res.status(400).send({ status: false, message: "Invalid city name" }) }
            }
        }
        if (address) {
            if (!(isEmpty(address.street))) { return res.status(400).send({ status: false, message: "street is Empty" }) }
        }

        /*------------------------Create User Data-----------------------------------*/
        const createData = await userModel.create(data)
        return res.status(201).send({ status: true, message: "Success", data: createData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const login = async function (req, res) {
    try {

        const { email, password } = req.body

        /*------------------------Checking body is empty or not-----------------------------------*/
        if (Object.keys(req.body).length == 0) { return res.status(400).send({ status: false, message: "Please provide email and password in body" }) }

        /*------------------------Checking fileds are present or not-----------------------------------*/
        if (!email) { return res.status(400).send({ status: false, message: "email is required" }) }
        if (!password) { return res.status(400).send({ status: false, message: "password is required" }) }

        /*------------------------Checking fileds values are empty or not-----------------------------------*/
        if (!(isEmpty(email))) { return res.status(400).send({ status: false, message: "email is empty." }) }
        if (!(isEmpty(password))) { return res.status(400).send({ status: false, message: "password is empty." }) }

        /*-------------------------------  Validation(Regex)  -----------------------------------*/
        if (!(isValidMail(email))) { return res.status(400).send({ status: false, message: "Please provide correct email" }) }
        if (!(isValidPassword(password))) { return res.status(400).send({ status: false, message: "Please provide correct passsword" }) }

        /*-------------------------------  Checking author in DB  -----------------------------------*/
        let userDetails = await userModel.findOne({ email: email, password: password })

        if (!userDetails) { return res.status(404).send({ status: false, message: "author is not present in our DB i.e., you have to register first" }) }

        /*------------------------------- Generate Token -----------------------------------*/
        let token = jwt.sign({
            userId: userDetails._id.toString(),
        }, "Secret-Key", { expiresIn: '24hr' })

        res.setHeader("x-api-key", token)
        res.status(200).send({ status: true, message: "Success", data: token })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { login, createUser }


