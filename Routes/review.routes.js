const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsyc = require('../utils/wrapAsyc.js');
const ExpressError = require('../utils/ExpressError.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const Review = require('../models/review.js');
const {createReview, deleteReview}=require('../controllers/review.controller.js');


// Create Review Route
router.post('/', validateReview,isLoggedIn, wrapAsyc(createReview));

// Delete Review Route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsyc(deleteReview));

// Edit comments
router.put('/:reviewId', validateReview,wrapAsyc(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, { ...req.body.review }, { new: true });
    res.redirect(`/listings/${id}`);
}));

module.exports = router;

