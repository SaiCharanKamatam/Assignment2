const express = require("express")
const body_parser = require("body-parser")

const { PostModel } = require("../models/userSchema")


const router = express.Router()
router.use(body_parser.json())





router.get("/posts", async (req, res) => {
    try {
        const posts = await PostModel.find()
        if (posts) {
            return res.status(200).json({
                posts
            })
        } else {
            return res.status(200).json({
                message: "no posts available"
            })
        }
    } catch (error) {
        return res.status(402).json({
            message: error.message
        })
    }
})

router.post("/posts", async (req, res) => {
    try {
        const {title,body,image} = req.body
        const post = await PostModel.create({
            title : title,
            body : body,
            image : image,
            user : req.user
        })
        res.json({
            post
        })
    } catch (error) {
       return res.status(403).json({
        message : error.message
       })
    }

})

router.put("/posts/:id", async (req, res) => {
    const id = req.params.id
    try {
        const post = await PostModel.findById(id)
        if(post){
            if(post.user==req.user){
                const editPost = await PostModel.updateOne({_id:id},req.body)
                res.status(203).json({
                    status : "success",
                    updtaed : req.body
                })
                 
            }else{
                res.status(404).json({
                    message : "you cannot edit this post"
                })
            }
        }else{
            res.status(404).json({
                message : "invalid id"
            })
        }
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }

})

router.delete("/posts/:id", async (req, res) => {
    const id = req.params.id
    try {
        const post = await PostModel.findById(id)
        if(post){
            if(post.user==req.user){
                const deletePost = await PostModel.deleteOne({_id:id})
                res.status(203).json({
                    status : "successfully deleted",
                })
                 
            }else{
                res.status(404).json({
                    message : "you cannot delete this post"
                })
            }
        }else{
            res.status(404).json({
                message : "invalid id"
            })
        }
    } catch (error) {
        res.status(400).json({
            message : error.message
        })
    }
})



module.exports = router