const express = require('express')
const router = express.Router()
const reivewController = require('../controllers/reviewController')

router.route('/')
    .post(reivewController.createReview)
    .patch(reivewController.updateReview)

router.route('/:reviewId')
    .delete(reivewController.deleteReview)

router.get('/by-rating', reivewController.getReviewsByRating)  // Dont forget the request looks like: /reviews/by-rating?minRating=4
router.get('/sort-by-date', reivewController.sortReviewByDate)
router.get('/sort-by-rating', reivewController.sortReviewsByRating)
router.get('/top-rated', reivewController.getTopRatedBooks)  // still working on it
router.get('/latest', reivewController.getLatestReview)
router.get('/avgRating/:bookId', reivewController.calculateAvgRating)  // still working on it

module.exports = router