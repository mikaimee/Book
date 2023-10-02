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

router.get('/search', bookController.searchBooks)  // Needs work
router.get('/filter', bookController.filterBooks)  // Needs work



module.exports = router