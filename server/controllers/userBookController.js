const UserBook = require('../models/UserBook')
const User = require('../models/User')
const Book = require('../models/Book')

const createUserBookAssociation = async (req, res) => {
    try {
        const { bookId, userId } = req.body

        const existingAssociation = await UserBook.findOne({ book: bookId, user: userId })
        if (existingAssociation) {
            return res.status(400).json({ error: "Association already exists "})
        }

        const userBook = new UserBook({ book: bookId, user: userId })
        await userBook.save()

        const user = await User.findById(userId)
        user.library.push(userBook._id)
        await user.save()

        res.status(201).json({ message: "Association successfully created", userBook })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while creating association" })
    }
}

const removeAssociation = async (req, res) => {
    try{
        const { associationId } = req.params
        const association = await UserBook.findById(associationId)
        if (!association) {
            return res.status(404).json({ error: "Association not found" })
        }

        const user = await User.findById(association.user)
        if(user) {
            const index = user.library.indexOf(associationId)
            if (index !== -1) {
                user.library.splice(index, 1)
                await user.save()
            }
        }

        await UserBook.findByIdAndDelete(associationId)

        res.status(204).send()
    }  
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while removing association" })
    }
}

const updateAssociation = async (req, res) => {
    try{
        const { associationId } = req.params
        const { readerStatus } = req.body

        const association = await UserBook.findById(associationId)
        if (!association) {
            return res.status(404).json({ error: "Association does not exist" })
        }
        association.book.readerStatus = readerStatus
        await association.book.save()

        res.status(200).json({ message: "Association updated successfullly "})
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while removing association" })
    }
}

// Retrieve details of specific association like data added to library
const getBookAssociationDetails = async (req, res) => {
    try {
        const { associationId } = req.params

        const association = await UserBook.findById(associationId).populate('book')
        if (!association) {
            return res.status(404).json({ error: "Book Association does not exist" })
        }
        res.status(200).json({ association })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occurred while retrieving book association details" })
    }
}

// WORK IN PROGRESS //

// User History
const getUserHistory = async (req, res) => {
    try {
        const userId = req.params.userId
        const history = await UserBook.find({ userId }).populate('book')
        if(history.length === 0) {
            return res.status(404).json({ error: "user has no history" })
        }
        res.status(200).json({ history })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occurred while retrieving user history" })
    }
}

// Start reading a book
const startReadingBook = async (req, res) => {
    try{
        const associationId = req.params.associationId;
        const { readerStatus, readerStarted } = req.body;

        // Update the UserBook association with the new values
        const updatedAssociation = await UserBook.findByIdAndUpdate(
            associationId,
            { readerStatus, readerStarted },
            { new: true } // To get the updated association after the update
        );
        if (!updatedAssociation) {
            return res.status(404).json({ error: "Association not found" });
        }

        // Update the book in the user's library here as well
        const user = await User.findById(updatedAssociation.user);
        const bookId = updatedAssociation.book;

        // Find the book in the user's library and update its fields
        const userLibraryBook = user.library.find((libraryBook) => libraryBook.book.equals(bookId));
        if (userLibraryBook) {
            userLibraryBook.readerStatus = readerStatus;
            userLibraryBook.readerStarted = readerStarted;
        }
        await user.save();

        res.status(200).json({ message: "Reader status and started date updated successfully", userLibraryBook })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while marking the book as complete" })
    }
}


module.exports = {
    createUserBookAssociation,
    removeAssociation,
    updateAssociation,
    getBookAssociationDetails,
    getUserHistory,
    startReadingBook
}