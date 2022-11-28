const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId


const booksSchema = new mongoose.Schema({

    title: {
        type: String,
        required: "Title is required",
        unique: "Title should be unique"
    },
    excerpt: {
        type: String,
        required: "The excerpt is required"
    },
    userId: {
        type: ObjectId,
        required: "User Id is mandatory",
        ref: 'User'
    },
    ISBN: {
        type: String,
        required: "ISBN is required",
        unique: "ISBN should be unique"
    },
    category: {
        type: String,
        required: "Category is required"
    },
    subcategory: {
        type: String,
        required: "Subcategory is required"
    },
    reviews: {
        type: Number,
        default: 0,
        comment: "Holds number of reviews of this book"
    },
    deletedAt: {
        type: Date,
       
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: String,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model("Book", booksSchema)
