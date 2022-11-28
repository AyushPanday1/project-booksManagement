const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController")

/*------------------------Create User-----------------------------------*/
router.post("/register", userController.createUser);

/*------------------------User Login-----------------------------------*/
router.post("/login", userController.login);

/*------------------------Fetch Books-----------------------------------*/
router.get("/books", bookController.allBooks);

/*---------------------------Book Create --------------------------------*/
router.post("/createbook" , bookController.createBook)

/*---------------------------Hit On Wrong Url --------------------------------*/
router.all("/*", function(req, res){
    return res.status(404).send({status:false, message : "Provided route url is wrong"})
})

module.exports = router
