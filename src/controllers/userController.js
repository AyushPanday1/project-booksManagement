const userModel = require('../models/userModel')
const validation = require('../validation/validation')

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
f