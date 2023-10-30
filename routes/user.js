const {Router} = require("express");
const router = Router();
const User = require("../models/user")
const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, path.resolve(`./public/images/`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName);
    }
  })
  
  const upload = multer({ storage: storage })

router.get("/signin",(req,res)=>{
    return res.render("signin");
})
router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.post("/signup",upload.single("profileImage"),async(req,res)=>{
    const {fullName,email,password,profileImage} = req.body;
     if(profileImage)
       profilePic=`/images/${req.file.filename}`;
    else{
        profilePic= "/images/default.png"
    }
    const check = User.find({email})
    if(check){
        res.render("signin",{
            error:"Already registered please login"
        })
    }
   else{
    await User.create({
        fullName,
        email,
        password,
        profileImageUrl:profilePic,
 })
 
 return res.redirect("/");
   }
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