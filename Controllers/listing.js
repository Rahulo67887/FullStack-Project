const Listing=require("../models/listing.js");
const ExpressError=require("../utils/expressError.js");

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}


module.exports.newFormRender=(req, res)=>{
    res.render("listings/new.ejs");
}

module.exports.createNewListing=async(req, res)=>{
    let url =req.file.path;
    let filename = req.file.filename;

    if(!req.body){
        throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm=async (req, res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    console.log(listing);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist")
        res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload", "/upload/h_300/,w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.editListing=async(req,res)=>{
    if(!req.body){
        throw new ExpressError(400, "Send valid data for listing");
    }
    let {id}=req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== 'undefined'){
        let url =req.file.path;
        let filename = req.file.filename;
        listing.image={url, filename};
        await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect("/listings");
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing =await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path : "reviews", populate :{ path : "createdBy",}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist")
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}