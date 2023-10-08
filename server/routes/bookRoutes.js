const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')
const upload = require('../middleware/multer')

router.route('/')
    .get(bookController.allBooks)
    .post( bookController.createBook)

router.route('/:bookId')
    .get(bookController.singleBook)
    .patch(bookController.updateBook)
    .delete(bookController.deleteBook)

router.route('/:bookId/uploadCoverImage')
    .put(bookController.updateCoverImage)

router.route('/search')
    .get(bookController.searchBooks)  // Needs work



module.exports = router