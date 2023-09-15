const BookGenre = require('../models/BookGenre')
const Book = require('../models/Book')

const createBookGenreAssociation = async (req, res) => {
    try {
        const {bookId, genreId} = req.body
        
        const existingAssociation = await BookGenre.findOne({ book: bookId, genre: genreId })
        if (existingAssociation) {
            return res.status(400).json({ error: "Association already exists" })
        }

        // Create the association
        const bookGenre = new BookGenre({ book: bookId, genre: genreId })
        await bookGenre.save()

        // Update the associated Book document's genre field
        const book = await Book.findById(bookId)
        book.genres.push(bookGenre._id)
        await book.save()

        res.status(201).json({ message: "Book and genre association created successfully", bookGenre})
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while creating association" })
    }
}

const getAllGenresForBook = async (req, res) => {
    try {
        const { bookId } = req.params
        const associations = await BookGenre.find({ book: bookId })
            .populate('genre')  // populate genre details
            .populate('book', 'title')  // populate book details
        res.status(200).json(associations)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while retreiving all genres for a book" })
    }
}

const getAllBooksForGenre = async (req, res) => {
    try{
        const { genreId } = req.params
        const associations = await BookGenre.find({ genre: genreId}).populate('book')
        res.status(200).json(associations)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while retreiving all books of genre" })
    }
}

const removeAssociation = async (req, res) => {
    try {
        const {associationId} = req.params
        await BookGenre.findByIdAndDelete(associationId)
        res.status(204).send()
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while deleting association" })
    }
}

const removeAllGenresForBook = async (req, res) => {
    try {
        const { bookId } = req.params
        await BookGenre.deleteMany({ book: bookId })
        res.status(204).send()
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while deleting all genres from a book" })
    }
}

const removeAllBooksForGenre = async (req, res) => {
    try {
        const { genreId } = req.params
        await BookGenre.deleteMany({ genre: genreId })
        res.status(204).send()
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while retreiving all books of genre" })
    }
}

// Create multiple book-genre associations in a single request
const bulkCreateAssociations = async (req, res) => {
    try {
        const { associations } = req.body
        await BookGenre.insertMany(associations)
        res.status(201).json({ message: "Associations created successfully"})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while retreiving all books of genre" })
    }
}

module.exports = { createBookGenreAssociation, getAllGenresForBook, getAllBooksForGenre, removeAssociation }