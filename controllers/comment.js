const verifyToken = require('../middlewares/verifyToken')
const Comment = require('../models/Comment')
const commentController = require('express').Router()


//create comment
commentController.post('/comment/:id', verifyToken, async(req, res) =>{
  try {
    const createdComment = await Comment.create({...req.body, userId: req.user.id, postId: req.params.id})
    return res.status(201).json(createdComment)
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

module.exports = commentController
