const express=require("express");
const router=express.Router({mergeParams : true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const reviewController=require("../Controllers/review.js");
const {validateReview, isLoggedIn, isReviewCreator, saveRedirectUrl}=require("../middleware.js");

router.post("/", isLoggedIn, validateReview, saveRedirectUrl, wrapAsync(reviewController.createNewReview));

//delete reveiw
router.delete("/:reviewId", isLoggedIn, isReviewCreator, saveRedirectUrl, wrapAsync(reviewController.destroyReview));

module.exports=router;