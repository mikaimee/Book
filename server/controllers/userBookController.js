const UserBook = require('../models/UserBook')
const User = require('../models/User')
const Book = require('../models/Book')

const createUserBookAssociation = async (req, res) => {
    try {
        const { bookId, readerStatus, readerStarted, readerFinished } = req.body
        const userId = req.user._id

        const existingAssociation = await UserBook.findOne({ book: bookId, user: userId })
        if (existingAssociation) {
            return res.status(400).json({ error: "Association already exists "})
        }

        const userBook = new UserBook({ book: bookId, user: userId, readerStatus, readerStarted, readerFinished })
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
        else {
            console.error("User not found for association:", associationId)
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
        const updateData = req.body

        const association = await UserBook.findByIdAndUpdate(associationId, updateData, { new: true })
        if (!association) {
            return res.status(404).json({ error: "Association does not exist" })
        }
        res.status(200).json({ message: "Association updated successfullly", association})
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while updating association" })
    }
}

// Retrieve all books for a single user
const getAllBooksForUser = async (req, res) => {
    try {
        const userId = req.user._id
        const associations = await UserBook.find({ user: userId })
            .populate({
                path: 'book',
                populate: {
                    path: 'genres',
                    populate: {
                        path: 'genre'
                    }
                }
            })  // populate book details
        res.status(200).json(associations)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({ error: "An error occured while retreiving all books for a user" })
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


module.exports = {
    createUserBookAssociation,
    removeAssociation,
    updateAssociation,
    getBookAssociationDetails,
    getUserHistory,
    getAllBooksForUser
}