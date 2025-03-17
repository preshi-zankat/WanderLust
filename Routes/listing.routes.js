const express = require('express');
const router = express.Router();
const wrapAsyc = require('../utils/wrapAsyc.js');

const { isLoggedIn,isOwner,validateListing } = require('../middleware.js');
const {index,renderNewForm,showListing,createListing,renderEditForm,upateListing, deletedListing} = require('../controllers/listing.controller.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });

// index routes
router.get("/", wrapAsyc(index));

// new routes
router.get('/new',isLoggedIn, wrapAsyc(renderNewForm));

// show routes
router.get('/:id', wrapAsyc(showListing));

//create routes
router.post('/',upload.single('listing[image]'), validateListing, wrapAsyc(createListing));

// Edit Route
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsyc(renderEditForm))

// update routes
router.put('/:id',isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsyc(upateListing));

// delete routes
router.delete('/:id',isLoggedIn,isOwner, wrapAsyc(deletedListing));

module.exports = router;