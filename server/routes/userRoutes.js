const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const protection = require('../middleware/jwt')

router.route('/')
    .get(userController.allUsers)
    .delete(userController.deleteUser)
    .patch(protection.authProtect, userController.updateUser)

router.route('/profile')
    .get(protection.authProtect, userController.oneUser)

router.route('/uploadProfilePicture')
    .put(protection.authProtect, userController.updateProfilePicture)

module.exports = router