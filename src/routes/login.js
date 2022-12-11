const express = require("express")
const jwt = require("jsonwebtoken")
const body_parser = require("body-parser")
const bcrypt = require("bcrypt")
const { UserModel } = require("../models/userSchema")
const { body, validationResult } = require('express-validator');
const router = express.Router()
const secret = "secretKey"
router.use(body_parser.json())
router.post("/register",
   body("name").isAlpha(),
   body("email").isEmail(),
   body("password").isAlphanumeric().isLength({ min: 6, max: 10 })
   , async (req, res) => {
      try {
         const errors = validationResult(req)
         if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
         }
         const { name, email, password } = req.body

         let user = await UserModel.findOne({ email })
         if (user) {
            return res.status(409).json({
               status: "Failed",
               message: "User already exists with the given email"
            })
         }
         bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
               return res.status(500).json({
                  status: "Failed",
                  message: err.message
               })
            }
            user = await UserModel.create({
               name: name,
               email: email,
               password: hash
            })

            res.json({
               status: "Success",
               message: "User succesfully created",
               user
            })

         })

      } catch (e) {
         res.json({
            status: "Failed",
            message: e.message
         })
      }
   })

router.post("/login",
   body("email").isEmail(),
   body("password").isEmpty()
   , async (req, res) => {
      try {
         const errors = validationResult("req")
         if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
         }
         const { email, password } = req.body

         const user = await UserModel.findOne({ email })
         if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
               if (err) {
                  return res.status(500).json({
                     status: "Failed",
                     message: err.message
                  })
               }
               if (result) {
                  const token = jwt.sign({
                     exp: Math.floor(Date.now() / 1000) + (60 * 60),
                     data: user._id
                  }, secret);

                  return res.json({
                     status: "Success",
                     message: "Login Succesful",
                     token
                  })
               }else{
                  return res.status(401).json({
                     status: "Failed",
                     message: "Invalid credentials"
                 })
               }
              
            })
         }


      } catch (e) {
         return res.status(404).json({
            message: e.message
         })
      }

   })

module.exports = router









