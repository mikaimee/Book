const express = require('express')
const router = express.Router()
const reivewController = require('../controllers/reviewController')
const protection = require('../middleware/jwt')

router.route('/')
    .post(protection.authProtect, reivewController.createReview)
    .patch(protection.authProtect, reivewController.updateReview)

router.route('/:reviewId')
    .delete(protection.authProtect, reivewController.deleteReview)

router.get('/by-rating', reivewController.getReviewsByRating)  // Dont forget the request looks like: /reviews/by-rating?minRating=4
router.get('/sort-by-date', reivewController.sortReviewByDate)
router.get('/sort-by-rating', reivewController.sortReviewsByRating)
router.get('/top-rated', reivewController.getTopRatedBooks)  // still working on it
router.get('/latest', reivewController.getLatestReview)
router.get('/avgRating/:bookId', reivewController.calculateAvgRating)  // still working on it

module.exports = router