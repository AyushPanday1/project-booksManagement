const express = require('express')
const router = express.Router() 
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController")
const middleware = require('../middleware/auth')
const reviewController = require("../controllers/reviewController")

/*------------------------Create User----------------------------------*/
router.post("/register", userController.createUser);

/*------------------------User Login-----------------------------------*/
router.post("/login", userController.login);

/*---------------------------Book Create ------------------------------*/
router.post("/createbook" , middleware.authenticate ,bookController.createBook)

/*------------------------Fetch Books----------------------------------*/
router.get("/books", middleware.authenticate, bookController.allBooks);

/*------------------------Fetch Books(path params)---------------------*/
router.get("/books/:bookId", middleware.authenticate, bookController.getBooksById);

/*-------------------------UPDATE BOOKS--------------------------------*/
router.put("/books/:bookId" , middleware.authenticate, middleware.authorization, bookController.updatebook)

/*-----------------------delete Book-----------------------------------*/
router.delete("/books/:bookId", middleware.authenticate, middleware.authorization ,bookController.deleteBook);

/*------------------------Create Review--------------------------------*/
router.post("/books/:bookId/review", reviewController.createReview);

/*------------------------Update Review--------------------------------*/
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);

/*------------------------Delete Review--------------------------------*/
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);

/*---------------------------Hit On Wrong Url -------------------------*/
router.all("/*", function(req, res){
    return res.status(404).send({status:false, message : "Provided route url is wrong"})
})

module.exports = router
