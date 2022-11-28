const bookModel = require("../models/bookmodel")

const allBooks = async function (req, res) {

    try {

        const { userId, category, subcategory } = req.query;

        let findObj = {
            isDeleted: false,
        }
        if (userId) {
            findObj["userId"] = userId
        }
        if (category) {
            findObj["category"] = category
        }
        if (subcategory) {
            findObj["subcategory"] = subcategory
        }
        
        let data = await bookModel.find(findObj).select({ _id: 1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1 });
        
       if (data.reviews > 0) {
        data.reviewsData = data.reviews;
       }

        if (data.length <= 0) return res.status(404).send({ Status: false, message: 'No Data Found' })

        res.status(200).send({ Status: true, message: "Book List", data: data })

    }   catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = {allBooks};

//nst jwt = require('jsonwebtoken')

const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken')

const login = async function (req, res) {
    try {
        const mail = req.body.email
        const pass = req.body.password
        const data = req.body
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, message: "No input provided" })

        if (!isValid(mail)) { return res.status(400).send({ status: false, message: "Email is required" }) }

        if (!isRightFormatemail(mail)) { return res.status(400).send({ status: false, message: 'Please provide a valid email' }) }

        if (!isValid(pass)) { return res.status(400).send({ status: false, message: "Password is required" }) }

        if (pass.length < 8 || pass.length > 15) { return res.status(400).send({ status: false, message: 'Password should be of minimum 8 characters & maximum 15 characters' }) }
        //validation ends

        const mailMatch = await userModel.findOne({ email: mail })
        if (!mailMatch) return res.status(400).send({ status: false, message: "Email is incorrect" })

        const passMatch = await userModel.findOne({ password: pass })
        if (!passMatch) return res.status(400).send({ status: false, message: "Password is incorrect" })

        const token = jwt.sign({
            userId: mailMatch._id.toString(), iat: new Date().getTime() / 1000,
        }, "Secret-Key", { expiresIn: "30m" });

        res.setHeader("x-api-key", "token");
        return res.status(200).send({ status: true, message: "You are successfully logged in", token })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}


module.exports.login = login;