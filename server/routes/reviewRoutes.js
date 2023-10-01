const express = require('express')
const router = express.Router()
const reivewController = require('../controllers/reviewController')
const protection = require('../middleware/jwt')

router.route('/')
    .post(protection.authProtect, reivewController.createReview)
    .patch(protection.authProtect, reivewController.updateReview)

router.route('/:reviewId')
    .delete(protection.authProtect, reivewController.deleteReview)


router.get('/:bookId/by-rating-asc', reivewController.getReviewsByRatingAsc)
router.get('/:bookId/by-rating-desc', reivewController.getReviewsByRatingDesc)


router.get('sort-by-date', reivewController.sortReviewByDate)
router.get('/sort-by-rating', reivewController.sortReviewsByRating)
router.get('/top-rated', reivewController.getTopRatedBooks)  // still working on it
router.get('/latest', reivewController.getLatestReview)  // still working on it

module.exports = router