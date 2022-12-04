const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookModel')
const {isValidObjectId} = require('mongoose')

const authenticate = async function(req, res, next){
    try{

        //PICKING THE TOKEN FROM HEADERS.---------------------------------------------------------
        const token = req.headers['x-api-key']
        if(!token){return res.status(400).send({status:false, message:"Token must be present in header"})}
    
        //VERIFYING THE TOKEN WITH SIGNATURE.-----------------------------------------------------
        jwt.verify(token, "Secret-Key", function(err, tokenVerify){
            if(err){
                return res.status(401).send({status:false, message:"Invalid token coming from header or token may be expired."})
            }else{
                req.tokenVerify = tokenVerify
                return next()
            }
        })
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

const authorization = async function(req, res ,next){
    try{
        let bookId = req.params.bookId
    
        if(!isValidObjectId(bookId)){return res.status(400).send({status:false, message:"Invalid Id"})}
    
        let book = await bookModel.findById(bookId)
    
        if(!book){return res.status(404).send({status:false, message:"book is not present in DB"})}
    
        //AUTHORISATION CHECK.--------------------------------------------------------------------------
        if(book.userId != req.tokenVerify.userId){return res.status(403).send({status:false, message:"you are unauthorized to make changes"})}
    
        next()
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

module.exports.authenticate = authenticate
module.exports.authorization = authorization