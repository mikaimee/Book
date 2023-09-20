const express = require('express')
const router = express.Router()
const genreController = require('../controllers/genreController')

router.route('/')
    .post(genreController.createGenre)
    .get(genreController.allGenres)

module.exports = router