const Book = require('../models/Book')
const Review = require('../models/Review')
const { v4: uuid } = require('uuid')
const uploadPicture = require('../middleware/multer')
const fileRemove = require('../util/fileRemover')

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
        const { title, author, pages, publishedDate, description, language, ISBN,  coverImage } = req.body

        const book = new Book({
            title,
            author,
            pages,
            ISBN,
            publishedDate,
            description,
            language,
            coverImage,
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
        res.status(200).json({ message: "Book updated successfully", book })
    }
    catch (error) {
        res.status(500).json({ error: "An error occured while updating book" })
    }
}

const updateCoverImage = async (req, res) => {
    try{
        const upload = uploadPicture.upload.single('coverImage') // key
        upload(req, res, async function (err) {
            if (err) {
                console.error('An error occured while uploading', err.message)
                return res.status(500).json({ message: 'File upload error' })
            }

            const bookId = req.params.bookId
            const updatedBook = await Book.findById(bookId)
            if (!updatedBook) {
                return res.status(404).json({ message: 'Book not found' })
            }

            const oldCoverImage = updatedBook.coverImage

            if (req.file) {
                const newCoverImage = req.file.filename
                updatedBook.coverImage = newCoverImage
                await updatedBook.save()
                console.log('Updated book:', updatedBook);
                if (oldCoverImage) {
                    console.log('Removing file:', oldCoverImage)
                    fileRemove.fileRemover(oldCoverImage)
                }
            }
            else {
                updatedBook.coverImage = ''
                await updatedBook.save()
                console.log('Updated book:', updatedBook);
                if (oldCoverImage) {
                    console.log('Removing file:', oldCoverImage)
                    fileRemove.fileRemover(oldCoverImage)
                }
            }

            const responseData = {
                _id: updatedBook._id,
                author: updatedBook.author,
                pages: updatedBook.pages,
                ISBN: updatedBook.ISBN,
                publishedDate: updatedBook.publishedDate,
                description: updatedBook.description,
                language: updatedBook.language,
                coverImage: updatedBook.coverImage,
                slug: updatedBook.slug
            }
            res.json(responseData)
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error' })
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

const singleBook = async (req, res) => {
    try{
        const bookId = req.params.bookId

        const book = await Book.findById(bookId).populate({
            path: 'reviews',
            populate: {
                path: 'user',
                select: 'firstName' // include only the 'firstName' field and exclude '_id'
            }
        })
        console.log(book)
        if(!book) {
            return res.status(404).json({ error: "Book not found" })
        }

        res.status(200).json({ book })
    }
    catch (error) {
        res.status(500).json({ error: "An error occured while retrieving the book" })
    }
}

// Search books based on title, author, genre, or keywords in description
const searchBooks = async (req, res) => {
    try{
        const { query } = req.query  // Get the search query from the request query parameters
        console.log('Search Query:', query);

        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
                { author: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ]
        })

        if(books.length === 0) {
            return res.status(404).json({ message: "No books found that fits search request"})
        }
        res.status(200).json({ books })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occured while searching the book" })
    }
}

const filterBooks = async (req, res) => {
    try{
        const { genre, readerStatus } = req.query

        const filterCriteria = {}
        
        if(genre) {
            filterCriteria.genres = { $in: genre }
        }

        if(readerStatus) {
            filterCriteria.readerStatus = readerStatus
        }

        const books = await Book.find(filterCriteria)
        if (books.length === 0) {
            return res.status(404).json({ message: "No founds found that fits criteria" })
        }
        res.status(200).json({ books })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occured while filtering" })
    }
}


module.exports = { 
    allBooks, 
    createBook, 
    updateBook, 
    deleteBook, 
    singleBook,
    searchBooks,
    filterBooks,
    updateCoverImage
}