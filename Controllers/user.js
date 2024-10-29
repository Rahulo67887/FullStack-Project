const User=require("../models/users.js");

module.exports.renderSignUp=(req, res)=>{
    res.render("users/signup.ejs");
}


module.exports.signUp=async(req, res)=>{
    try{
        let {username, email, password}=req.body;
        const newUser=new User({email, username});
        const registeredUser=await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }  
}


module.exports.renderLogin=(req, res)=>{
    res.render("users/login.ejs");
}


module.exports.login=async(req, res)=>{
    req.flash("success","Welcome back to WanderLust!");
    console.log(res.locals.redirectUrl);
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("err", "You are logged out!");
        res.redirect("/listings");
    })
}