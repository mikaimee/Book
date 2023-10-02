const Rating = require('../models/Rating')
const Book = require('../models/Book')

const createRating = async (req, res) => {
    try {
        const { bookId, rating } = req.body

        const book = await Book.findById(bookId)
        if (!book) {
            return res.status(400).json({ error: "Book is not found" })
        }

        const newRating = new Rating({ 
            user: req.user._id,
            book: bookId, 
            rating
        })
        await newRating.save()
        res.status(201).json({ message: "Rating created successfully", rating: newRating })
    }
    catch(error) {
        res.status(500).json({ error: "An error occured while creating rating" })
    }
}

const updateRating = async (req, res) => {
    try {
        const ratingId = req.params.ratingId
        const userId = req.user._id
        const { rating } = req.body

        const existingRating  = await Rating.findById(ratingId)
        if (!existingRating) {
            return res.status(404).json({ error: "Rating not found" })
        }

        if (existingRating.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Unauthorized: You can only update your own ratings"})
        }

        existingRating.rating = rating
        await existingRating.save()
        res.status(200).json({ message: "Rating updated successfully", updatedRating: existingRating })
    }
    catch(error) {
        console.error("Error updating rating:", error)
        res.status(500).json({ error: 'An error occured while updating rating' })
    }
}

const deleteRating = async (req, res) => {
    try {
        const ratingId = req.params.ratingId
        const userId = req.user._id

        const rating = await Rating.findById(ratingId)
        if (!rating) {
            return res.status(404).json({ error: "Rating not found" })
        }

        if (rating.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Unauthorized: You can only delete your own ratings"})
        }

        const result = await Rating.deleteOne({ _id: ratingId })
        if (result.deletedCount === 0) {
            return res.status(400).json({ error: "Rating not found" })
        }
        res.status(200).json({ message: "Rating deleted successfully" })
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while deleting rating" })
    }
}

const getSingleRating = async (req, res) => {
    try {
        const ratingId = req.params.ratingId
        const userId = req.user._id
        const rating = await Rating.findById(ratingId)
        if (!rating) {
            return res.status(404).json({ error: "Rating not found" })
        }
        if (rating.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Unauthorized: You can only see your own ratings"})
        }
        res.status(200).json({ rating })
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while deleting rating" })
    }
}


module.exports = {
    createRating,
    updateRating,
    deleteRating,
    getSingleRating
}