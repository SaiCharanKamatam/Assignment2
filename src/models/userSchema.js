const mongoose = require("mongoose")
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
       type : String,
       required : true,
       unique : true
    },
    password : {
        type : String,
        required : true,
    }
})

const UserModel =  mongoose.model("Users",userSchema)

const postSchema = new Schema({
    title : {
        type : String,
        required : true,
        unique : true
    },
    body : {
       type : String,
    },
    image : {
        type : String,
        required : true,
    },
    user : {
        type : ObjectId,
        ref : "UserModel",
        required : true
    }
   
})

const PostModel =  mongoose.model("Posts",postSchema)

module.exports = {UserModel,PostModel}