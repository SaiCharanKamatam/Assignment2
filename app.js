const express = require("express")
const app = express()
const loginRouter = require("./src/routes/login")
const postRouter = require("./src/routes/posts")
const jwt = require("jsonwebtoken")
const secret = "secretKey"

app.use("/",loginRouter)
app.use('/user/posts', (req, res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization?.split("Bearer ")[1];
        if(token){
            // verify a token symmetric
            jwt.verify(token, secret, function(err, decoded) {
                if(err) {
                    return res.status(403).json({
                        status: "failed",
                        message: "Not a valid token"
                    })
                }
                req.user =  decoded.data
                next();
            });
        }else {
            return res.status(401).json({
                status: "Failed",
                message: "Toeken is missing"
            })
        }
    }else {
        return res.status(403).json({
            status: "Failed",
            message: "Not authenticated user"
        })
    }

})  
  
app.use("/user",postRouter)



module.exports = app