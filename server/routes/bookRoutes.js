const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')

router.route('/')
    .get(bookController.allBooks)
    .post(bookController.createBook)

router.route('/:bookId')
    .patch(bookController.updateBook)
    .delete(bookController.deleteBook)

module.exports = router