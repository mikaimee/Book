const express = require('express')
const router = express.Router()
const userBookController = require('../controllers/userBookController')
const protection = require('../middleware/jwt')

router.route('/')
    .post(protection.authProtect, userBookController.createUserBookAssociation)

router.route('/myLibrary')
    .get(protection.authProtect, userBookController.getAllBooksForUser)

router.route('/:associationId')
    .delete(userBookController.removeAssociation)
    .patch(userBookController.updateAssociation)
    .get(userBookController.getBookAssociationDetails)

router.route('/history/:userId')  // Working on it
    .get(userBookController.getUserHistory)

router.route('/start/:associationId')
    .patch(userBookController.startReadingBook)
module.exports = router