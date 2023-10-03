const {Schema , model} = require("mongoose");
const {createHmac , randomBytes} = require("crypto");
const {createToken} = require("../services/authentication")
const userSchema = new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    },
    salt:{
        type:String,
        
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default:"/images/default.png",
    }

},{timestamps:true})

userSchema.pre("save",function (next) {
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashPassword = createHmac("sha256",salt).update(user.password).digest("hex");
    user.salt = salt;
    user.password = hashPassword;
    next();
});

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user = await this.findOne({email});
    if(!user)  throw new Error("Incorrect credentials");

    const salt = user.salt;
    const userProvidedHash =createHmac("sha256",salt).update(password).digest("hex");
    const hashPassword = user.password;
    if( hashPassword !== userProvidedHash)
      throw new Error("Incorrect credentials");
     
      const token = createToken(user);
       return token;
      //return {...user,password:undefined , salt:undefined}

})


const User = model("user",userSchema);
module.exports = User;