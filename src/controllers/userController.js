const userModel = require('../models/userModel')
const validation = require('../validation/validation')
const jwt = require("jsonwebtoken")

const {isEmpty, isValidTitle, isValidPhone, isValidMail, isValidFullName, isValidPassword} = validation

const createUser = async function(req,res){
    try{

        const data = req.body
        const {title, name, phone, email, password, } = data
    
        /*------------------------Checking body is empty or not-----------------------------------*/
        if(Object.keys(data).length==0){return res.status(400).send({status:false, message:"Please provide data in request body"})}
    
        /*------------------------Checking fileds are present or not-----------------------------------*/
        if(!title){return res.status(400).send({stauts:false, message:"title is required"})}
        if(!name){return res.status(400).send({stauts:false, message:"name is required"})}
        if(!phone){return res.status(400).send({stauts:false, message:"phone is required"})}
        if(!email){return res.status(400).send({stauts:false, message:"email is required"})}
        if(!password){return res.status(400).send({stauts:false, message:"password is required"})}
    
        /*------------------------Checking fileds values are empty or not-----------------------------------*/
        if(!(isEmpty(title))){return res.status(400).send({stauts:false, message:"title is required"})}
        if(!(isEmpty(name))){return res.status(400).send({stauts:false, message:"name is required"})}
        if(!(isEmpty(phone))){return res.status(400).send({stauts:false, message:"phone is required"})}
        if(!(isEmpty(email))){return res.status(400).send({stauts:false, message:"email is required"})}
        if(!(isEmpty(password))){return res.status(400).send({stauts:false, message:"password is required"})}
        /*------------------------Checking mail is unique or not-----------------------------------*/
        const uniqueEmail = await userModel.find({email:email})
        if(!uniqueEmail){return res.status(400).send({status : false, message : "email is already exit"})}
        const uniquePhone = await userModel.find({phone:phone})
        if(!uniquePhone){return res.status(400).send({status : false, message : "phone is already exit"})} 
        /*-------------------------------  Validation(Regex)  -----------------------------------*/
        if(!(isValidTitle(title))){return res.status(400).send({status : false, msg : "Please enter correct title ex: Mr, Mrs, Miss"})}
        if(!(isValidPhone(phone))){return res.status(400).send({status : false, msg : "Invalid phone number"})}
        if(!(isValidMail(email))){return res.status(400).send({status : false, msg : "Invalid email Id"})}
        if(!(isValidFullName(name))){return res.status(400).send({status : false, msg : "Please provide valid full name"})}
        if(!(isValidPassword(password))){return res.status(400).send({status : false, msg : "Invalid password"})}
        const createUser = await userModel.create(data)
        return res.status(201).send({stauts:true, message:"Success", data:createUser})
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}


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
            userId: mailMatch._id.toString()  //iat: new Date().getTime() / 1000,
        }, "Secret-Key", { expiresIn: "30m" });

        res.setHeader("x-api-key", "token");
        return res.status(201).send({ status: true, message: "You are successfully logged in", token })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}


module.exports = {login, createUser}


