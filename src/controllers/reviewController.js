const reviewModel = require("../models/reviewModel");
const bookModel  = require("../models/bookmodel");
const mongoose = require("mongoose");
const validation = require('../validation/validation');
const {isValidFullName, isValidDate, isValidNumber} = validation
const { isValidObjectId } = require("mongoose")
const moment = require("moment")


const createReview = async function(req, res) {
    try{
    let bookId = req.params.bookId;
    if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ Status: false, message: "Invalid Book Id" })

    let {reviewedBy, rating, review } = req.body;

    if(!(isValidFullName(reviewedBy))){return res.status(400).send({status : false, msg : "Please provide valid name"})}
    if(!(isValidNumber(rating))){return res.status(400).send({status : false, msg : "Please provide valid rating"})}
    if (rating < 1 || rating > 5) return res.status(400).send({status: false, message: "Rating not valid"})

    let bookData = await bookModel.findById(bookId);
    if (!bookData) return res.status(404).send({status: false, message: "No data found"})
    if (bookData.isDeleted == true) return res.status(404).send({status: false, message: "Book is already deleted"})
    
    let today = moment().format("YYYY-MM-DD", "hh-mm-ss a")
    await reviewModel.create({bookId: bookId, reviewedBy: reviewedBy, reviewedAt: today, rating: rating, review: review})
    let totalReviews = await reviewModel.find({bookId: bookId}).select({_id:1, bookId:1, reviewedBy:1, reviewedAt:1, rating:1, review:1})

    let { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, releasedAt, createdAt, updatedAt } = bookData;

  
    let obj = { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, reviews: totalReviews.length, releasedAt, createdAt, updatedAt, reviewsData: totalReviews }
    
    await bookModel.findByIdAndUpdate( bookId ,{ $set: { reviews: totalReviews.length }})
    return res.status(200).send({status: true, data: obj})
    
}   catch(err){
    return res.status(500).send({status: false, message: err.message})
}
}

const updateReview = async function(req,res) {

    const bookId = req.params.bookId
    const reviewId = req.params.reviewId
    if (!isValidObjectId(bookId)) return res.status(400).send({ stauts: false, message: "userId is invalid" })
    if (!isValidObjectId(reviewId)) return res.status(400).send({ stauts: false, message: "reviewId is invalid" })
    
    const data = req.body;
    if(Object.keys(data).length == 0 ) 
    return res.status(400).send({status:false , message:"Data is required."})
    
    let bookData = await bookModel.findById(bookId)
    if (!bookData) return res.status(404).send({status: false, message: "Book not found"})
    if (bookData.isDeleted == true) return res.status(404).send({status: false, message: "Book has been deleted"})

    let reviewData = await reviewModel.findById(reviewId)
    if (!reviewData) return res.status(404).send({status: false, message: "No review found"})
    if (reviewData.isDeleted == true) return res.status(404).send({status: false, message: "Review has been deleted"})
    
    const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { reviewedBy: data.reviewedBy, reviewedAt: Date.now(), rating: data.rating, review: data.review } }, { new: true })
    const totalReviews = await reviewModel.find({bookId: bookId}).select({_id:1, bookId:1, reviewedBy:1, reviewedAt:1, rating:1, review:1})

    let { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, releasedAt, createdAt, updatedAt } = bookData;
    
    let obj = { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, reviews: totalReviews.length, releasedAt, createdAt, updatedAt, reviewsData: totalReviews }
    
    return res.status(200).send({ status: true, message: "Success", data: obj })
}

const deleteReview = async function(req,res) {

    const bookId = req.params.bookId
    const reviewId = req.params.reviewId
    if (!isValidObjectId(bookId)) return res.status(400).send({ stauts: false, message: "userId is invalid" })
    if (!isValidObjectId(reviewId)) return res.status(400).send({ stauts: false, message: "reviewId is invalid" })
     
    let bookData = await bookModel.findById(bookId)
    if (!bookData) return res.status(404).send({status: false, message: "Book not found"})
    if (bookData.isDeleted == true) return res.status(404).send({status: false, message: "Book has been deleted"})

    let reviewData = await reviewModel.findById(reviewId)
    if (!reviewData) return res.status(404).send({status: false, message: "No review found"})
    if (reviewData.isDeleted == true) return res.status(404).send({status: false, message: "Review has been deleted"})

    const deleteReview = await reviewModel.findOneAndDelete({_id: reviewId})
    const totalReviews = await reviewModel.find({bookId: bookId}).select({_id:1, bookId:1, reviewedBy:1, reviewedAt:1, rating:1, review:1})

    let { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, releasedAt, createdAt, updatedAt } = bookData;
    
    let obj = { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, reviews: totalReviews.length, releasedAt, createdAt, updatedAt, reviewsData: totalReviews }

    let updatedBookData = await bookModel.findByIdAndUpdate( bookId ,{ $set: { reviews: totalReviews.length }})
    
    return res.status(200).send({ status: true, message: "Success", data: obj })
}

module.exports = {createReview, updateReview, deleteReview}