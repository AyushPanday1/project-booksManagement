const express = require('express')
const router = express.Router()

//dummy
router.get('/check', function(req,res){
    return res.send("perfectly working")
})

module.exports = router