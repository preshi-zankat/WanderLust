const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://d3oo9u3p09egds.cloudfront.net/rental_property/colina-villa-h/01_Facade__10_.jpeg",
            set: (v) => v === "" ? "https://d3oo9u3p09egds.cloudfront.net/rental_property/colina-villa-h/01_Facade__10_.jpeg" : v
        },

    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;


// default:"https://d3oo9u3p09egds.cloudfront.net/rental_property/colina-villa-h/01_Facade__10_.jpeg",
// type:String,
// set:(v)=>v===""?"https://d3oo9u3p09egds.cloudfront.net/rental_property/colina-villa-h/01_Facade__10_.jpeg":v,
