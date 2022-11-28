const mongoose = require("mongoose");
const moment = require("moment");
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    excerpt: {
        type:String,
        required:true,
        trim:true
    }, 
    userId: {
        type:ObjectId,
        ref:"user",
        required:true,
    },
    ISBN: {
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    category: {
        type:String,
        required:true,
        trim:true
    },
    subcategory: {
        type:[String],
        required:true,
        trim:true
    },
    reviews: {
        type:Number,
        default: 0, 
        comment:{type:Number}
    },
    isDeleted: {
        type:Boolean, 
        default: false
    },
    deletedAt: {
        type:Date
    }, 
    releasedAt: {
        type:String,
        required:true
        
    },
},{timestamps:true})


module.exports = mongoose.model("book",bookSchema)