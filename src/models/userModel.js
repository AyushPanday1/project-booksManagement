const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        enum : ["Mr", "Mrs", "Miss"]
    },
    name : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    address : {
        street : {
            type : String,
            trim : true
        },
        city : {
            type : String
        },
        pincode : {
            type : String,
        }
    }
}, {timestamps:true})

module.exports = mongoose.model('User', userModel) 