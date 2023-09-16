const Review = require('../models/Review')
const Book = require('../models/Book')
const User = require('../models/User')

const createReview = async (req, res) => {
    try {
        const { bookId, userId, rating, text } = req.body

        const book = await Book.findById(bookId)
        const user = await User.findById(userId)
        if (!book || !user) {
            return res.status(400).json({ error: "Book or user is not found" })
        }

        const review = new Review({ book, user, rating, text })
        await review.save()
        res.status(201).json({ message: "Review created successfully", review })
    }
    catch(error) {
        res.status(500).json({ error: "An error occured while creating review" })
    }
}

const updateReview = async (req, res) => {
    try {
        const { reviewId, rating, text } = req.body
        
        const review = await Review.findById(reviewId)
        if (!review) {
            return res.status(404).json({ error: "Review not found" })
        }

        // Update the review details if provided
        //typeof is a operator used to check the data type of variable or expression
        if (typeof rating !== 'undefined') {
            review.rating = rating
        }
        if (typeof text !== 'undefined') {
            review.text = text
        }
        await review.save()
        res.status(200).json({ message: 'Review updated successfully', review})
    }
    catch(error) {
        res.status(500).json({ error: 'An error occured while updating review' })
    }
}

const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId

        const result = await Review.deleteOne({ _id: reviewId })
        if (result.deletedCount === 0) {
            return res.status(400).json({ error: "Review not found" })
        }
        res.status(200).json({ message: "Review deleted successfully" })
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while deleting review" })
    }
}

// Calculate the average rating of a book
const calculateAvgRating = async (req, res) => {
    try {
        const bookId = req.params.bookId
        const reviews = await Review.find({ book: bookId })

        if (reviews.length === 0) {
            return res.status(200).json({ averageRating: 0})
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = totalRating / reviews.length

        res.status(200).json({ averageRating })
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while calculating the average rating" })
    }
}

// Get the latest review
const getLatestReview = async (req, res) => {
    try {
        const limit = req.query.limit || 10   // default limit is 10 reviews
        const latestReviews = await Review.find()
            .sort({ createdAt: -1})   // Sort by creating date in descending order
            .limit(limit)
        
        res.status(200).json({latestReviews})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while retreiving the latest review" })
    }
}

// Get top-rated books
const getTopRatedBooks = async (req, res) => {
    try {
        const limit = req.query.limit || 10
        const books = await Book.find()
        const topRatedBooks = []

        for (const book of books) {
            const averageRating = await calculateAvgRating(req, res, book._id)
            topRatedBooks.push({
                bookId: book._id,
                title: book.title,
                averageRating
            })
        }

        // Sort the top-rated books by average rating in descending order
        topRatedBooks.sort ((a, b) => b.averageRating - a.averageRating)

        // Limit number of top-rated books to retrieve
        const limitedTopRatedBooks = topRatedBooks.slice(0, limit)

        res.status(200).json(limitedTopRatedBooks)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while retreiving the top-rated books" })
    }
}

// Get Reviews by Rating
const getReviewsByRating = async (req, res) => {
    try {
        const minRating = parseInt(req.query.minRating) || 1
        const maxRating = parseInt(req.query.maxRating) || 5

        const reviews = await Review.find({
            rating: { $gte: minRating, $lte: maxRating } 
        })
        res.status(200).json(reviews)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occurred while retrieving reviews by rating" })
    }
}

// Sort Reviews by Date
const sortReviewByDate = async (req, res) => {
    try {
        const sortOrder = req.query.order === 'asc' ? 1 : -1

        const reviews = await Review.find()
            .sort({ createdAt: sortOrder })
        res.status(200).json(reviews)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occurred while sorting reviews by date" })
    }
}

// Sort Reviews by Rating
const sortReviewsByRating = async (req, res) => {
    try {
        const sortOrder = req.query.order === 'asc' ? 1 : -1

        const reviews = await Review.find()
            .sort({ rating: sortOrder })
        res.status(200).json(reviews)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occurred while sorting reviews by rating" })
    }
}

module.exports = { 
    createReview, 
    updateReview, 
    deleteReview, 
    calculateAvgRating, 
    getLatestReview,
    getTopRatedBooks,
    getReviewsByRating,
    sortReviewByDate,
    sortReviewsByRating
}