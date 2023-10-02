const express = require('express')
const router = express.Router()
const protection = require('../middleware/jwt')
const ratingController = require('../controllers/ratingController')

router.route('/')
    .post(protection.authProtect, ratingController.createRating)

router.route('/:ratingId')
    .get(protection.authProtect, ratingController.getSingleRating)
    .patch(protection.authProtect, ratingController.updateRating)
    .delete(protection.authProtect, ratingController.deleteRating)


module.exports = router