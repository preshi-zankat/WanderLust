const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsyc.js");
const ExpressError=require("../utils/ExpressError.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js")
const Review=require("../models/Review.js");
const Listing=require("../models/listing.js");
const reviewController=require("../controllers/Review.js");


//Reviews
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
   
//Detlet Review route
   router.delete("/:reviewId",isReviewAuthor,
   isLoggedIn,wrapAsync(reviewController.deleteReview))

   module.exports=router;