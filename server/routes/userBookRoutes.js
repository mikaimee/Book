const express = require('express')
const router = express.Router()
const userBookController = require('../controllers/userBookController')

router.route('/')
    .post(userBookController.createUserBookAssociation)

router.route('/:associationId')
    .delete(userBookController.removeAssociation)
    .patch(userBookController.updateAssociation)

module.exports = router