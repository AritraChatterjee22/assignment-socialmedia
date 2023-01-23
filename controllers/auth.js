const authController = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

authController.post('/register', async(req, res) => {
  try {
    const isExsisting = await User.findOne({email: req.body.email})

    if(isExsisting){
      return res.status(500).json({msg: "Email already taken"})
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const newUser = await User.create({...req.body, password: hashedPassword})

    const {password, ...others} = newUser._doc
    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET)

    return res.status(201).json({user: others, token})
  } catch (error) {
      return res.status(500).json(error.message)
  }
})


//email: email2gmail.com
//password: 12345


authController.post("/authenticate", async(req, res) => {
  try {
    const user = await User.findOne({email: req.body.email})
    if(!user){
      return res.status(500).json({msg: 'Wrong credentials'})
    }
    const comparePassword = await bcrypt.compare(req.body.password, user.password)
    if(!comparePassword){
      return res.status(500).json({msg: 'Wrong credentials'})
    }

    const {password, ...others} = user._doc
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,)

    return res.status(200).json({ token})
  } catch (error) {
      return res.status(500).json(error.message)
  }
})

module.exports = authController
