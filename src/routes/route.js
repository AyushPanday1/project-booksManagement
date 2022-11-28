const express = require('express')
const router = express.Router()
const UserController = require("../controllers/userController");

router.post("/login", UserController.login);


console.log("1")

module.exports = router