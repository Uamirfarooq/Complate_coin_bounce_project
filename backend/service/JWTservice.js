
const jwt = require("jsonwebtoken")
const refreshToken = require("../modles/token")

// const  REFRESH_TOKEN_SECRET  = "16549de0490d3c4187b4a9291a9604b2a883ce9e1016ab494a76539c0f9f5b2e962003227d325ce9b15c75263af653dc3eb1875b68f7aac8a23d28a064eb3c4b"
// const  ACCESS_TOKEN_SECRET  = "365a0866d78876904a1e158f4a54d3c7cf48b9b2fbcd57d10c798fd03834a7d6c02d58e97d40c1a643550a809f5279116638cfc71912f1633a2c2ebdfcded598"


const {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET}= require("../config/index")

class JWTService{
    static signAccessToken(payload,expiryTime){
        return jwt.sign(payload ,ACCESS_TOKEN_SECRET,{expiresIn:expiryTime})
    }

    static signRefreshToken(payload,expiryTime){
        return jwt.sign(payload ,REFRESH_TOKEN_SECRET ,{expiresIn: expiryTime})
    }   
    static verifyAccessToken(token){
        return jwt.verify(token,ACCESS_TOKEN_SECRET)
    }

    static verifyRefreshToken(token){
        return jwt.verify(token,REFRESH_TOKEN_SECRET)
    }
   static async storeRefreshToken(token,userId){
        try {
            refreshToken = new refreshToken({
                token:token,
                userId:userId
            });

            await newToken.save();
        } catch (error) {
            console.log(error);
        }
    }


}
module.exports = JWTService;