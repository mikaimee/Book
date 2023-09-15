const Book = require('../models/Book')
const Review = require('../models/Review')
const { v4: uuid } = require('uuid')

const allBooks = async (req, res) => {
    try{
        const books = await Book.find()
        res.status(200).json({ books })
    }
    catch(error) {
        res.status(500).json({ error: "An error occured while retreiving books" })
    }
}

const createBook = async (req, res) => {
    try {
        const { title, author, pages, publishedDate, description, language, coverImage, readerStatus, readerStarted, readerFinished, rating, ISBN } = req.body
        
        const book = new Book({
            title,
            author,
            pages,
            ISBN,
            publishedDate,
            description,
            language, 
            readerStatus,
            readerStarted,
            readerFinished,
            coverImage,
            rating,
            slug: uuid()
        })
        await book.save()
        res.status(201).json({ message: "Book created successfully", book })
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while creating book" })
    }
}

const updateBook = async (req, res) => {
    try{
        const bookId = req.params.bookId
        const updateData = req.body

        const book = await Book.findByIdAndUpdate(bookId, updateData, { new: true })
        if (!book) {
            return res.status(404).json({ error: "Book not found" })
        }
        res.status(500).json({ message: "Book updated successfully", book })
    }
    catch (error) {
        res.status(500).json({ error: "An error occured while updating book" })
    }
}

const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.bookId

        const deletedBook = await Book.findByIdAndDelete(bookId)
        if (!deletedBook) {
            return res.status(404).json({ error: "Book not found"})
        }
        res.status(200).json({ message: "book deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ error: "An error occured while deleting the book" })
    }
}

// const singleBook = async (req, res) => {
//     try{
//         const bookId = req.params.bookId

//         const book = await Book.findById(bookId).populate({
//             path: 'reviews',
//             populate: {
//                 path: 'user',
//                 select: 'firstName' // include only the 'firstName' field and exclude '_id'
//             }
//         })
//         if(!book) {
//             return res.status(404).json({ error: "Book not found" })
//         }
        
//         const averageRating = book.averageRating

//         res.status(200).json({ book, averageRating })
//     }
//     catch (error) {
//         res.status(500).json({ error: "An error occured while retrieving the book" })
//     }
// }

module.exports = { allBooks, createBook, updateBook, deleteBook }