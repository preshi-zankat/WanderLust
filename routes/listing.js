const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController=require("../controllers/Listings.js")

const multer=require('multer');
const upload=multer({dest:'uploads/'})

router.route("/").get( wrapAsync(listingController.index))
// .post( isLoggedIn, validateListing,
//   wrapAsync(listingController.createListing)
// );
.post(upload.single('listing[image]'),(req,res)=>{
  res.send(req.file)
})

//New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router.route("/:id").get( wrapAsync(listingController.showListing))
.post(isLoggedIn, isOwner,
  validateListing, wrapAsync(listingController.upateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deletedListing));

//New Route
//router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;