const UserBook = require('../models/UserBook')
const User = require('../models/User')

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


module.exports = {
    createUserBookAssociation,
    removeAssociation,
    updateAssociation
}