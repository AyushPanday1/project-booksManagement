const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const mongoose = require("mongoose");
const validation = require('../validation/validation');
const { isValidFullName, isValidRating } = validation
const { isValidObjectId } = require("mongoose")
const moment = require("moment")


const createReview = async function (req, res) {
    try {
        /*.................Getting bookId from params....................*/
        let bookId = req.params.bookId;

        /*.................Checking if valid bookId.....................*/
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ Status: false, message: "Invalid Book Id" })

        /*.................If body is empty..............................*/
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Data is required." })
        
        /*.................Checking validity of fields.................*/
        let { reviewedBy, rating, review } = req.body;
        if (!(isValidFullName(reviewedBy))) return res.status(400).send({ status: false, msg: "Please provide valid name" })
        if (!(isValidRating(rating))) return res.status(400).send({ status: false, msg: "Please provide valid rating" })
       
        /*.................Checking if book data is present in DB.....*/
        let bookData = await bookModel.findById(bookId);
        if (!bookData) return res.status(404).send({ status: false, message: "No data found" })
        if (bookData.isDeleted == true) return res.status(404).send({ status: false, message: "Book is already deleted" })

        /*.................Using moment on reviewedAt.................*/
        let today = moment().format("YYYY-MM-DD", "hh-mm-ss a")

        /*................Creating a review...........................*/
        await reviewModel.create({ bookId: bookId, reviewedBy: reviewedBy, reviewedAt: today, rating: rating, review: review })

        /*................Fetching all the reviews which are present..*/
        let totalReviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        /*................Destructuring book data.....................*/
        let { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, releasedAt, createdAt, updatedAt } = bookData;

        /*................Adding reviewsData key in bookData..........*/
        let obj = { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, reviews: totalReviews.length, releasedAt, createdAt, updatedAt, reviewsData: totalReviews }

        /*................Updating review count in bookData...........*/
        await bookModel.findByIdAndUpdate(bookId, { $set: { reviews: totalReviews.length } })

        /*................Returning bookData with reviews............*/
        return res.status(200).send({ status: true, message: "Book list", data: obj })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const updateReview = async function (req, res) {

    try {
        /*.................Getting bookId from params....................*/
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        /*.................Checking if valid bookId......................*/
        if (!isValidObjectId(bookId)) return res.status(400).send({ stauts: false, message: "userId is invalid" })
        /*.................Checking if valid reviewId....................*/
        if (!isValidObjectId(reviewId)) return res.status(400).send({ stauts: false, message: "reviewId is invalid" })

        const data = req.body;
        /*.................If body is empty..............................*/
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Data is required." })

        /*................Checking validity of fields....................*/
        if (!(isValidRating(data.rating))) return res.status(400).send({ status: false, msg: "Please provide valid rating" })
        if (!(isValidFullName(data.reviewedBy))) return res.status(400).send({ status: false, msg: "Please provide valid name" })

        /*.................Checking if book data is present in DB.......*/
        let bookData = await bookModel.findById(bookId)
        if (!bookData) return res.status(404).send({ status: false, message: "Book not found" })
        if (bookData.isDeleted == true) return res.status(404).send({ status: false, message: "Book has been deleted" })

        /*.................Checking if review data is present in DB.....*/
        let reviewData = await reviewModel.findOne({ _id: reviewId, bookId: bookId })
        if (!reviewData) return res.status(404).send({ status: false, message: "No review found" })
        if (reviewData.isDeleted == true) return res.status(404).send({ status: false, message: "Review has been deleted" })

        /*.................Using moment on reviewedAt..................*/
        let today = moment().format("YYYY-MM-DD", "hh-mm-ss a")

        /*.................Updating the review.........................*/
        await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { reviewedBy: data.reviewedBy, reviewedAt: today, rating: data.rating, review: data.review } }, { new: true })
        /*..................Fetching all the reviews present..........*/
        const totalReviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        /*................Destructuring book data.....................*/
        let { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, reviews, releasedAt, createdAt, updatedAt } = bookData;

        /*................Adding reviewsData key in bookData..........*/
        let obj = { _id, title, excerpt, userId, ISBN, category, subcategory, isDeleted, reviews, releasedAt, createdAt, updatedAt, reviewsData: totalReviews }

        /*................Returning bookData with reviews............*/
        return res.status(200).send({ status: true, message: "Book list", data: obj })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const deleteReview = async function (req, res) {
    try {
        /*.................Getting bookId from params....................*/
        const bookId = req.params.bookId
        /*.................Getting reviewId from params..................*/
        const reviewId = req.params.reviewId
        /*.................Checking if valid bookId......................*/
        if (!isValidObjectId(bookId)) return res.status(400).send({ stauts: false, message: "userId is invalid" })
        /*.................Checking if valid reviewIdId..................*/
        if (!isValidObjectId(reviewId)) return res.status(400).send({ stauts: false, message: "reviewId is invalid" })

        /*.................Checking if book data is present in DB.......*/
        let bookData = await bookModel.findById(bookId)
        if (!bookData) return res.status(404).send({ status: false, message: "Book not found" })
        if (bookData.isDeleted == true) return res.status(404).send({ status: false, message: "Book has been deleted" })

        /*.................Checking if review data is present in DB......*/
        let reviewData = await reviewModel.findOne({ _id: reviewId, bookId: bookId })
        if (!reviewData) return res.status(404).send({ status: false, message: "No review found" })
        if (reviewData.isDeleted == true) return res.status(404).send({ status: false, message: "Review has been deleted" })

        /*..................Updating isDeleted to true..................*/
        await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: { isDeleted: true } })
        /*..................Fetching all the reviews present...........*/
        const totalReviews = await reviewModel.find({ bookId: bookId, isDeleted: false })
        /*..................Decreasing the review count by 1..........*/
        await bookModel.findByIdAndUpdate(bookId, { $set: { reviews: totalReviews.length } })
        /*..................Sending response with message.............*/
        return res.status(200).send({ status: true, message: "Data deleted successfully" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createReview, updateReview, deleteReview }