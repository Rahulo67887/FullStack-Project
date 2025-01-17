const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const {reviewSchema}=require("./schema.js");
const {listingSchema}=require("./schema.js");
const ExpressError=require("./utils/expressError.js")

module.exports.isLoggedIn=(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async (req, res, next)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to edit!");
        res.redirect("/listings");
    }
    next();
}

module.exports.isReviewCreator=async (req, res, next)=>{
    let {id, reviewId}=req.params;
    let review =await Review.findById(reviewId);
    // console.log(currUser);
    if(!review.createdBy._id.equals(req.user._id)){
        req.flash("error", "You didn't create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res, next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
    
}

module.exports.validateReview=(req,res, next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}