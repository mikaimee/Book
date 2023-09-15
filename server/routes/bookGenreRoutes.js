const express = require('express')
const router = express.Router()
const bookGenreController = require('../controllers/bookGenreController')

router.route('/')
    .post(bookGenreController.createBookGenreAssociation)

router.route('/book/:bookId')
    .get(bookGenreController.getAllGenresForBook)

router.route('/genre/:genreId')
    .get(bookGenreController.getAllBooksForGenre)

router.route('/:associationId')
    .delete(bookGenreController.removeAssociation)

module.exports = router