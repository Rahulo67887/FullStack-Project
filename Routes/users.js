const express=require("express");
const router=express.Router();
const User=require("../models/users.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../Controllers/user.js");

router.route("/signup")
    .get(userController.renderSignUp)
    .post(wrapAsync(userController.signUp));

router.route("/login")
    .get(userController.renderLogin)
    .post( 
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect : "/login",
            failureflash : true,
        }), 
        userController.login);

router.get("/logout", userController.logout);

module.exports=router;