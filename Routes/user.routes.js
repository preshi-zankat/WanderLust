const express = require("express");
const router = express.Router();
//const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { saveRedirecUrl } = require("../middleware.js");
const {createUser,renderLoginForm,login,logout,renderSignupForm}=require("../controllers/user.controller.js")

router.get("/signup", wrapAsync(renderSignupForm));   

router.post("/signup",wrapAsync(createUser));

router.get("/login", wrapAsync(renderLoginForm));

router.post("/login",
    saveRedirecUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:"Invalid username or password"}),wrapAsync( login));

router.get("/logout",wrapAsync(logout));

module.exports = router;