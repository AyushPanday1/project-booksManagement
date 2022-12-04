const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const mongoose = require("mongoose");
const validation = require('../validation/validation');
const { isValidRating, isEmpty } = validation
const { isValidObjectId } = require("mongoose")
const moment = require("moment")


const createReview = async function (req, res) {
    try {
        /*.................Getting bookId from params....................*/
        let bookId = req.params.bookId;

        /*.................Checking if valid bookId.....................*/
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Invalid Book Id" })

        /*.................Getting data from request body..............*/
        let data = req.body

        /*.................If body is empty..................... ......*/
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Data is required." })

        /*................Destructuring body data....................*/
        let { reviewedBy, rating } = data;

        /*------------------------Checking fileds are present or not-----------------------------------*/
        if (!rating) { return res.status(400).send({ status: false, message: "rating is required" }) }

        /*------------------------Checking fileds values are empty or not-----------------------------------*/
        if (!isEmpty(reviewedBy)) { return res.status(400).send({ status: false, message: "reviewedBy is Empty" }) }

        /*-------------------------------Validation(Regex)  -----------------------------------*/
        if (!isValidRating(rating)) { return res.status(400).send({ status: false, message: "rating is invalid. Please provide rating between 1 and 5" }) }

        /*................Updating review count in bookData...........*/
        let updateBookData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true }).select({ __v: 0 })

        /*...............Checking if book data exist.................*/
        if (!updateBookData) return res.status(404).send({ status: false, message: "No data found or data is deleted" })

        /*.................Using moment on reviewedAt.................*/
        let today = moment().format("YYYY-MM-DD", "hh-mm-ss a")

        /*.........Adding bookId and reviewedAt to reviewData........*/
        data.bookId = bookId
        data.reviewedAt = today

        /*...................Creating a review......................*/
        let addReview = await reviewModel.create(data)

        /*.............Adding wanted keys to review data..............*/
        let reviewData = {
            _id: addReview._id,
            bookId: addReview.bookId,
            reviewedBy: addReview.reviewedBy,
            reviewedAt: addReview.reviewedAt,
            rating: addReview.rating,
            review: addReview.review
        }

        /*................Adding reviewData in book...................*/
        let bookWithReview = { ...updateBookData._doc, reviewsData: [reviewData] }

        /*................Returning bookData with reviews............*/
        return res.status(201).send({ status: true, message: "success", data: bookWithReview })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const updateReview = async function (req, res) {

    try {
        /*............Getting Book Id and Review Id from params............*/
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        /*.................Checking if valid Book Id......................*/
        if (!isValidObjectId(bookId)) return res.status(400).send({ stauts: false, message: "userId is invalid" })
        /*.................Checking if valid Review Id....................*/
        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "reviewId is invalid" })

        /*.................Getting data from request body................*/
        let data = req.body;

        /*...................Destructuring body data.....................*/
        let { reviewedBy, rating, review } = data

        /*.................If body is empty.............................*/
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Data is required." })

        /*------------------------Checking fileds values are empty or not-----------------------------------*/
        if (!(isEmpty(reviewedBy))) return res.status(400).send({ status: false, message: "reviewedBy is Empty." })

        if (rating || rating === 0 || rating === "") {
            if (!(isEmpty(rating))) return res.status(400).send({ status: false, message: "rating is Empty." })
        }

        /*................Checking validity of fields....................*/
        if (rating || rating === 0) {
            if (!(isValidRating(rating))) return res.status(400).send({ status: false, message: "rating is invalid. Please provide rating between 1 and 5" })
        }

        /*.................Checking if book data exist..................*/
        let bookData = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ ISBN: 0, __v: 0 })
        if (!bookData) return res.status(404).send({ status: false, message: "Book not found" })

        /*.................Updating the review.........................*/
        let reviewData = await reviewModel.findOneAndUpdate({ bookId: bookId, _id: reviewId, isDeleted: false }, { $set: { reviewedBy, rating, review } },
            { new: true }).select({ isDeleted: 0, __v: 0, createdAt: 0, updatedAt: 0 })

        /*.................Checking if review data exist..............*/
        if (!reviewData) return res.status(404).send({ status: false, message: "Review not found or is deleted" })

        /*................Adding reviewData in book...................*/
        let bookWithReview = { ...bookData._doc, reviewsData: [reviewData] }

        /*................Returning bookData with reviews............*/
        return res.status(200).send({ status: true, message: "success", data: bookWithReview })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const deleteReview = async function (req, res) {
    try {
        /*.................Getting bookId from params....................*/
        let bookId = req.params.bookId

        /*.................Getting reviewId from params..................*/
        let reviewId = req.params.reviewId

        /*.................Checking if valid bookId......................*/
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "User Id invalid" })

        /*.................Checking if valid reviewIdId..................*/
        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Review Id is invalid" })

        /*.................Checking if book data is present in DB.......*/
        let bookData = await bookModel.findById(bookId)
        if (!bookData) return res.status(404).send({ status: false, message: "Book not found" })
        if (bookData.isDeleted == true) return res.status(404).send({ status: false, message: "Book has already been deleted" })

        /*....Checking if review exist & then updating is deleted to true...*/
        let reviewData = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId, isDeleted: false }, { $set: { isDeleted: true } })
        if (!reviewData) return res.status(404).send({ status: false, message: "Review not found or is deleted" })

        await bookModel.findByIdAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })

        /*..................Sending response with message.............*/
        return res.status(200).send({ status: true, message: "Data deleted successfully" })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createReview, updateReview, deleteReview }