if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressError.js")
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/users.js");

const listingRouter=require("./Routes/listings.js");
const reviewRouter=require("./Routes/review.js");
const userRouter=require("./Routes/users.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

const mongoUrl='mongodb://127.0.0.1:27017/wanderlust';
const dbUrl=process.env.ATLASDB_URL;


const store=MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter:24*3600,
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
}

store.on("error", ()=>{
    console.log("Error in MongoDb", err);
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser=req.user;
    next(); 
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

async function main() {
    await mongoose.connect(dbUrl);
}

main()
.then((res)=>{
  console.log("db connected");
})
.catch((err) => console.log(err));

// root route
// app.get("/", (req,res)=>{
//     res.send("you are on the root page");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "Something went wrong!"}=err;
    console.log(err);
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080, ()=>{
    console.log("Server is listening at port 8080");
});