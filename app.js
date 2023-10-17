require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {checkForAuthentication} = require("./middlewares/authentication.js")
const blogRoute = require("./routes/blog")
const Blog = require("./models/blog")
mongoose.connect(process.env.MONGO_URL).then((e)=>console.log("db connected"))
                                                     .catch((err)=>console.log("err"))

const app = express();
const userRoute = require("./routes/user");

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.static(path.resolve("./public")))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuthentication("token"));


app.get("/",async(req,res)=>{
    const allBlogs = await Blog.find({}).sort("asc -1")
    return res.render("home",{
        user:req.user,
        blogs:allBlogs,
    });
})
app.use("/user",userRoute);
app.use("/blog",blogRoute)
app.listen(process.env.PORT,()=>console.log("SERVER STARTED"));

