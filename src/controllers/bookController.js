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



