const express = require('express')
const router = express.Router()
const userBookController = require('../controllers/userBookController')
const protection = require('../middleware/jwt')

router.route('/')
    .post(protection.authProtect, userBookController.createUserBookAssociation)

router.route('/myLibrary')
    .get(protection.authProtect, userBookController.getAllBooksForUser)

router.route('/:associationId')
    .delete(protection.authProtect, userBookController.removeAssociation)
    .patch(protection.authProtect, userBookController.updateAssociation)
    .get(protection.authProtect, userBookController.getBookAssociationDetails)

router.route('/history/:userId')  // Working on it
    .get(userBookController.getUserHistory)

module.exports = router