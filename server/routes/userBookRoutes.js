const express = require('express')
const router = express.Router()
const userBookController = require('../controllers/userBookController')

router.route('/')
    .post(userBookController.createUserBookAssociation)

router.route('/user/:userId')
    .get(userBookController.getAllBooksForUser)

router.route('/:associationId')
    .delete(userBookController.removeAssociation)
    .patch(userBookController.updateAssociation)
    .get(userBookController.getBookAssociationDetails)

router.route('/history/:userId')  // Working on it
    .get(userBookController.getUserHistory)

router.route('/start/:associationId')
    .patch(userBookController.startReadingBook)
module.exports = router