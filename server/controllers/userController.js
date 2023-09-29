const User = require("../models/User")
const uploadPicture = require('../middleware/multer')
const fileRemove = require('../util/fileRemover')

const allUsers = async(req, res) => {
    const users = await User.find()
    if(!users) return res.status(204).json({message: 'No users found'})
    res.json(users)
}

const oneUser = async(req, res) => {
    try {
        let user = await User.findById(req.user._id).populate('library')

        if(user) {
            return res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePicture: user.profilePicture,
                isAdmin: user.isAdmin,
                library: user.library,
            })
        }
        else {
            return res.status(401).json({message: "User is not found"})
        }
    }
    catch(err) {
        console.log(err)
    }
}

const updateUser = async(req, res) => {
    try {
        let user = await User.findById(req.user._id)
        if(!user) {
            return res.status(401).json({message: "User is not found"})
        }

        user.firstName = req.body.firstName || user.firstName
        user.lastName = req.body.lastName || user.lastName
        user.email = req.body.email || user.email
        if (req.body.password && req.body.password.length < 8) {
            return res.json({message: "Password must be at least 8 characters long"})
        }
        else if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
            isAdmin: updatedUser.isAdmin,
            library: updatedUser.library,
            token: await updatedUser.getSigninToken(),
            message: `${updatedUser.firstName} updated`
        })
    }
    catch (err) {
        console.log(err)
    }
}

const updateProfilePicture = async (req, res) => {
    try {
        const upload = uploadPicture.upload.single('profilePicture') // key
        upload(req, res, async function (err) {
            if (err) {
                console.error('An error occured while uploading', err.message)
                return res.status(500).json({ message: 'File upload error' })
            }

            const userId = req.user._id
            const updatedUser = await User.findById(userId)

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' })
            }

            const oldProfilePicture = updatedUser.profilePicture

            if (req.file) {
                const newProfilePicture = req.file.filename
                updatedUser.profilePicture = newProfilePicture
                await updatedUser.save()
                console.log('Updated user:', updatedUser);
                if (oldProfilePicture) {
                    console.log('Removing file:', oldProfilePicture)
                    fileRemove.fileRemover(oldProfilePicture)
                }
            }
            else {
                updatedUser.profilePicture = ''
                await updatedUser.save()
                console.log('Updated user:', updatedUser);
                if (oldProfilePicture) {
                    console.log('Removing file:', oldProfilePicture)
                    fileRemove.fileRemover(oldProfilePicture)
                }
            }

            const responseData = {
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
                isAdmin: updatedUser.isAdmin,
                library: updatedUser.library,
                token: await updatedUser.getSigninToken(),
                message: `${updatedUser.firstName} updated`
            }
            res.json(responseData)
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const deleteUser = async (req, res) => {
    if (!req?.body?._id) {
        return res.status(400).json({messgae: 'User id is required'})
    }
    const user = await User.findOne({_id: req.body._id}).exec()
    if (!user) {
        return res.status(204).json({message: `User with ID of ${req.body._id} is not found`})
    }
    const result = await user.deleteOne({_id: req.body._id})
    res.json(result)
}

module.exports = {
    allUsers,
    oneUser,
    updateUser,
    deleteUser,
    updateProfilePicture
}