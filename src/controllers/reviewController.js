const reviewModel = require("../models/reviewModel");
const bookModel  = require("../models/bookmodel");
const mongoose = require("mongoose");
const validation = require('../validation/validation');
const {isValidFullName, isValidDate, isValidNumber} = validation

const createReview = async function(req, res) {

    let bookIdParams = req.params.bookId;
    if (!mongoose.Types.ObjectId.isValid(bookIdParams)) return res.status(400).send({ Status: false, message: "Invalid Book Id" })

    let data = req.body;
    let { bookId,  reviewedBy, reviewedAt, rating } = req.body;
    if(!bookId) return res.status(400).send({status: false, message: "bookId is mandatory"})
    if(!reviewedBy) return res.status(400).send({status: false, message: "reviewdBy is mandatory"})
    if(!reviewedAt) return res.status(400).send({status: false, message: "reviewedAt is mandatory"})
    if(!rating) return res.status(400).send({status: false, message: "rating is mandatory"})

    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ Status: false, msg: "Invalid Book Id" })
    if(!(isValidFullName(reviewedBy))){return res.status(400).send({status : false, msg : "Please provide valid name"})}
    if(!(isValidDate(reviewedAt))){return res.status(400).send({status : false, msg : "Please provide valid date"})}
    if(!(isValidNumber(rating))){return res.status(400).send({status : false, msg : "Please provide valid rating"})}

    let bookData = await bookModel.findById(bookId);
    if (!bookData) return res.status(404).send({status: false, message: "No data found"})
    if (bookData.isDeleted == true) return res.status(404).send({status: false, message: "Book is already deleted"})

    if (bookId !== bookIdParams) return res.status(401).send({status: false, message: "Unauthorised access"})
    let review = await reviewModel.create(data)
    let totalReviews = await reviewModel.find()

    let { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, reviews, releasedAt,createdAt, updatedAt } = bookData;

    let obj = { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, reviews: totalReviews.length, releasedAt, createdAt, updatedAt, reviewsData: totalReviews }

    let updatedBookData = await bookModel.findOneAndUpdate( { _id: bookId },{ $set: { reviews: totalReviews.length }})

    return res.status(200).send({status: true, data: obj})
}

module.exports = {createReview}