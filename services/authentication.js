const JWT = require("jsonwebtoken");

const secret ="$heidhffilf$$hufjbdknds"
function createToken (user){
     const payload = {
        _id : user.id,
        email:user.email,
        fullName:user.fullName,
        role:user.role,
        profileImageUrl:user.profileImageUrl,
     }
     const token = JWT.sign(payload,secret);
     return token;
}

function validateToken(token){
    
    const userDetailsPayload = JWT.verify(token,secret);
    console.log(userDetailsPayload);
    return userDetailsPayload;
}

module.exports = {
    createToken,
    validateToken
}