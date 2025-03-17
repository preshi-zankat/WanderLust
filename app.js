if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}
const express = require('express');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const app = express();
const path = require('path');
const ListingRoutes=require('./Routes/listing.routes.js');
const ReviewRoutes=require('./Routes/review.routes.js');
const UserRoutes=require('./Routes/user.routes.js');
const ExpressErorr = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// �� Connect-Mongo Configuration
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  secret:process.env.SECRET,
  touchAfter: 24 * 60 * 60 * 1000
});

store.on("error",()=>{
  console.log("Session Store Error",error);
})

// 🔹 Session Configuration
const sessionConfig = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}


app.use(
  session(sessionConfig)
);

// 🔹 Flash Message Configuratio
app.use(flash());

const PORT = 8080;

// 🔹 MongoDB Connection with Error Handling
const  connectDB = require('./db/db.js');
const { error } = require('console');
connectDB();

// �� Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 🔹 Middleware to show flash messages

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user
  next();
});


// listing routes
app.use('/listings',ListingRoutes);

// Review routes
app.use('/listings/:id/reviews',ReviewRoutes);

// User routes
app.use('/',UserRoutes);

// 404 Page Not Found Middleware
app.all('*', (req, res, next) => {
  next(new ExpressErorr(404, "Page Not Found"));
});

// 🔹 Error Handling Middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render('error.ejs', { err });
});

// 🔹 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
