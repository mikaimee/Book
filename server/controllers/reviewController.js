// const Review = require('../models/Review')
// const Book = require('../models/Book')
// const User = require('../models/User')

// const createReview = async (req, res) => {
//     try {
//         const { bookId, userId, rating, text } = req.body

//         const book = await Book.findById(bookId)
//         const user = await User.findById(userId)
//         if (!book || !user) {
//             return res.status(400).json({ error: "Book or user is not found" })
//         }

//         const review = new Review({ book, user, rating, text })
//         await review.save()
//         res.status(201).json({ message: "Review created successfully", review })
//     }
//     catch(error) {
//         res.status(500).json({ error: "An error occured while creating review" })
//     }
// }

// const updateReview = async (req, res) => {
//     try {
//         const { reviewId, rating, text } = req.body
        
//         const review = await Review.findById(reviewId)
//         if (!review) {
//             return res.status(404).json({ error: "Review not found" })
//         }

//         // Update the review details if provided
//         //typeof is a operator used to check the data type of variable or expression
//         if (typeof rating !== 'undefined') {
//             review.rating = rating
//         }
//         if (typeof text !== 'undefined') {
//             review.text = text
//         }
//         await review.save()
//         res.status(200).json({ message: 'Review updated successfully', review})
//     }
//     catch(error) {
//         res.status(500).json({ error: 'An error occured while updating review' })
//     }
// }

// const deleteReview = async (req, res) => {
//     try {
//         const reviewId = req.params.reviewId

//         const review = await Review.findById(reviewId)
//         if(!review) {
//             return res.status(404).json({ error: "Review not found" })
//         }

//         await review.remove()
//         res.status(200).json({ message: "Review deleted successfully" })
//     }
//     catch(error) {
//         res.status(500).json({ error: "An error occured while deleting review" })
//     }
// }

// module.exports = { createReview, updateReview, deleteReview }