const User = require('../models/User')
const bcrypt = require('bcrypt')
const userController = require('express').Router()
const verifyToken = require('../middlewares/verifyToken')
const { findById } = require('../models/User')


//view profile
userController.get('/user', verifyToken, async(req, res) =>{
  try {
    const user = await User.findById(req.user.id)
    const {password, ...others} = user._doc
    return res.status(200).json({username: user.username, followers: user.followers, followings: user.followings })

  } catch (error) {
    return res.status(500).json(error.message)
  }
})


//follow

userController.put('/follow/:otherUserId', verifyToken, async(req, res) =>{
  try {
    const currentUserId = req.user.id
    const otherUserId = req.params.otherUserId

    if(currentUserId === otherUserId){
      return req.status(500).json({msg: 'You cannot follow yourself'})
    }

    const currentUser = await User.findById(currentUserId)
    const otherUser = await  User.findById(otherUserId)


    if(!currentUser.followings.includes(otherUserId)){
      currentUser.followings.push(otherUserId)
      otherUserId.followers.push(currentUserId)
      await currentUser.save()
      await otherUser.save()
      return res.status(200).json({msg: 'You have followed the user'})
    }
    else{
      currentUser.followings = currentUser.followings.filter((id) => id !== otherUserId)
      otherUser.followers = otherUser.followers.filter((id) => id !== currentUserId)
      await currentUser.save()
      await otherUser.save()
      return res.status(200).json({msg: 'You have unfollowed the user'})
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
})


//unfollow
userController.put('unfollow/:otherUserId', verifyToken, async(req, res) =>{
  try {
    const currentUserId = req.user.id
    const otherUserId = req.params.otherUserId

    const currentUser = await User.findById(currentUserId)
    const otherUser = await  User.findById(otherUserId)


    if(currentUser.followings.includes(otherUserId)){
      currentUser.followings = currentUser.followings.filter((id) => id !== otherUserId)
      otherUser.followers = otherUser.followers.filter((id) => id !== currentUserId)
      await currentUser.save()
      await otherUser.save()
      return res.status(200).json({msg: 'You have unfollowed the user'})
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
 
})

module.exports = userController
