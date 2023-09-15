const express = require('express')
const router = express.Router()
const genreController = require('../controllers/genreController')

router.route('/')
    .post(genreController.createGenre)

module.exports = router