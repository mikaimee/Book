const Review = require('../models/Review')
const Book = require('../models/Book')
const User = require('../models/User')

const createReview = async (req, res) => {
    try {
        const { bookId, rating, text } = req.body

        const book = await Book.findById(bookId)
        if (!book) {
            return res.status(400).json({ error: "Book is not found" })
        }

        const review = new Review({ 
            user: req.user._id,
            book, 
            rating, 
            text 
        })
        await review.save()
        res.status(201).json({ message: "Review created successfully", review })
    }
    catch(error) {
        res.status(500).json({ error: "An error occured while creating review" })
    }
}

const updateReview = async (req, res) => {
    try {
        const { reviewId, text } = req.body
        
        const review = await Review.findById(reviewId)
        if (!review) {
            return res.status(404).json({ error: "Review not found" })
        }

        // Update the review details if provided
        //typeof is a operator used to check the data type of variable or expression
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

// Get Reviews by Rating (1 -> 5)
const getReviewsByRatingAsc = async (req, res) => {
    try {
        const bookId = req.params.bookId
        const reviews = await Review.find({ book: bookId}).populate('rating')
        reviews.sort((a, b) => a.rating.rating - b.rating.rating)
        res.status(200).json({reviews})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occurred while retrieving reviews by rating" })
    }
}

// Get Reviews by Rating (5 -> 1)
const getReviewsByRatingDesc = async (req, res) => {
    try {
        const bookId = req.params.bookId
        const reviews = await Review.find({ book: bookId}).populate('rating')
        reviews.sort((a, b) => b.rating.rating - a.rating.rating)
        res.status(200).json({reviews})
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
    getLatestReview,
    getTopRatedBooks,
    getReviewsByRatingAsc,
    getReviewsByRatingDesc,
    sortReviewByDate,
    sortReviewsByRating
}