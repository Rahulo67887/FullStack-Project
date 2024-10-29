const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
// const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/expressError.js");
const Listing=require("../models/listing.js");
const listingController=require("../Controllers/listing.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");
const multer=require("multer");
const {storage} = require("../cloudConfig.js");
const upload=multer({storage});


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,  
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createNewListing)
    );

//new listing route
router.get("/new", isLoggedIn, listingController.newFormRender);

router.route("/:id")
    .put(isLoggedIn, isOwner, upload.single("listing[image]"),  validateListing, wrapAsync(listingController.editListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))
    .get(wrapAsync(listingController.showListing));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports=router;
