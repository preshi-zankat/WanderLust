const User=require("../models/user")
const Listing=require("../models/listing")

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs")
}

module.exports.createUser = async (req, res, next) => {  // Added next
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);

        req.login(registerUser, (err) => {
            if (err) {
                return next(err); // Ensure no duplicate responses
            }
            req.flash("success", "Welcome to Wanderlust!");
            return res.redirect("/listings"); // Ensure only one response is sent
        });
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        return res.redirect("/signup"); // Ensure only one response is sent
    }
};


module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs")
}

module.exports.login=async (req, res) => {

    req.flash("success","Welcome back to Wanderlust!")
    let redirectUrl= res.locals.redirectUrl || "/listings"
    
    res.redirect(redirectUrl)
}

module.exports.logout = async (req, res, next) => {
    req.logout((err)=>{
        if(err) return next(err);
        req.flash("success", "Goodbye!");
    res.redirect("/listings");
    });
}

