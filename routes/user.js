const {Router} = require("express");
const router = Router();
const User = require("../models/user")

router.get("/signin",(req,res)=>{
    return res.render("signin");
})
router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.post("/signup",async(req,res)=>{
    const {fullName,email,password} = req.body;
     console.log(fullName+email+password);
   await User.create({
           fullName,
           email,
           password,
    })
    
    return res.redirect("/");
})

router.post("/signin",async(req,res)=>{
    const{email,password} = req.body;

   try {
    const token = await User.matchPasswordAndGenerateToken(email,password);
       return res.cookie("token",token).redirect("/");  
   } catch (error) {
    return res.render("signin",{
        error:"incorrect credentials"
    });
   }
})
router.get("/logout",(req,res)=>{
    return res.clearCookie("token").redirect("/user/signin");
})


module.exports = router;