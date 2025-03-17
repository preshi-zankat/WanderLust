const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

require("dotenv").config();
const jwt = require("jsonwebtoken");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);



module.exports = mongoose.model("User", UserSchema);