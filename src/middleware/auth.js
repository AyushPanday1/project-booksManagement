const jwt = require('jsonwebtoken')

const authenticate = async function(req, res, next){
    try{
        const token = req.headers['x-api-key']
        if(!token){return res.status(400).send({status:false, message:"Token must be present in header"})}
    
        jwt.verify(token, "Secret-Key", function(err, tokenVerify){
            if(err){
                return res.status(401).send({status:false, message:"Invalid token coming from header"})
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

module.exports.authenticate = authenticate