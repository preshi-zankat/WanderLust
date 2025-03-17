const Listing = require("../models/listing");
const cloudinary = require('cloudinary').v2;

module.exports.index = async (req, res) => {
    let { search, minPrice, maxPrice } = req.query;
    let filter = {};
  
    if (search) {
      filter.title = new RegExp(search, "i"); // Case-insensitive search
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
  
    const listings = await Listing.find(filter);
  
    res.render('listings/index.ejs', { listings, search, minPrice, maxPrice });
  }


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews", populate: { path: "author",},
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings")
    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "New Listing created!")
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings")
    }
   let originalImage = listing.image.url;
   originalImage = originalImage.replace('upload','upload/w_250');
    listing.image = originalImage;
    res.render("listings/edit.ejs", { listing, originalImage });
}

module.exports.upateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file!=='undefined'){
        // delete old image
        await cloudinary.uploader.destroy(listing.image.filename);
    
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.deletedListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
     // Delete the image from Cloudinary
    if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
    }
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    return res.redirect("/listings");
} 

