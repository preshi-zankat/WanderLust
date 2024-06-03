const express = require("express");
//const { any } = require("joi");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsyc = require("../utils/wrapAsyc.js");
const passport = require("passport");
//const { route } = require("./listing.js");
const {saveRedirecUrl}=require("../middleware.js")
const userController=require("../controllers/User.js");

router.route("/signUp").get( userController.renderSignupForm)
.post( wrapAsyc(userController.createUser));

router.route("/login").get( userController.renderLoginForm)
.post(
    saveRedirecUrl, 
    passport.authenticate("local", { 
        failureRedirect: "/login", 
        failureFlash: true
     }), 
     userController.login
)

router.get("/logout",userController.logout)
module.exports = router;