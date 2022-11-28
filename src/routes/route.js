const express = require('express')
const router = express.Router()

//dummy
router.get('/check', function(req,res){
    return res.send("perfectly working")
})

console.log("1")

module.exports = router