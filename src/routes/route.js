const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController")

router.post("/register", userController.createUser);
router.post("/login", userController.login);
router.get("/books", bookController.allBooks);
router.get("/createbook" , bookController.createBook)


console.log("1")

module.exports = router