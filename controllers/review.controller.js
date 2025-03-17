const Listing=require("../models/listing");
const Review=require("../models/review")

module.exports.createReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    const review = new Review(req.body.review);
    review.author=req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
     req.flash('success', 'Created new review!');
    res.redirect(`/listings/${listing._id}`);
}


module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review!');
    res.redirect(`/listings/${id}`);
}