const Listing=require("./models/listing")
const Review=require("./models/Review.js")
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{   
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error","You must be logged in to creat listing");
       return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirecUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You don't have permission to edit");
     return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    //console.log(result);
    if(error){
      let errorMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(404,errorMsg)
    }
    else{
      next();
    }
  }


  module.exports.validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    //console.log(result);
    if(error){
      let errorMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(404,errorMsg)
    }
    else{
      next();
    }
  }

//   module.exports.isReviewAuthor=async(req,res,next)=>{
//     let {id,reviewId } = req.params;
//     let review=await Review.findById(reviewId)
//     if(!review.author.equals(res.locals.currUser._id)){
//       req.flash("error","You don't have permission to review");
//      return res.redirect(`/listings/${id}`)
//     }
//     next();
// }


module.exports.isReviewAuthor = async (req, res, next) => {
  // Extracting 'id' and 'reviewId' from request parameters
  let { id, reviewId } = req.params;
  
  // Finding the review by its ID
  let review = await Review.findById(reviewId);

  // Checking if the review exists and if the current user is the author of the review
  if (!review.author.equals(res.locals.currUser._id)) {
      // If the user is not the author of the review, flash an error message and redirect
      req.flash("error", "You don't have permission to review");
      return res.redirect(`/listings/${id}`);
  }

  // If the user is the author of the review, proceed to the next middleware
  next();
}

