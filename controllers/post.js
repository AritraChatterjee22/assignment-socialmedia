const { verify } = require('jsonwebtoken')
const verifyToken = require('../middlewares/verifyToken')
const Post = require('../models/Post')
const postController = require('express').Router()
const Comment = require('../models/Comment.js')

//create Post
postController.post('/posts', verifyToken, async(req,res) =>{
  try {
    const newPost = await Post.create({...req.body, userId: req.user.id})

    return res.status(201).json({PostID: newPost._id, Title: newPost.title, Description: newPost.desc, CreatedAt: newPost.timestamps})
  } catch (error) {
    return res.status(500).json(error.message)
  }
})


// get all
postController.get('/all_posts', async(req, res) => {
    try {
        const comments = await Comment.find({ })
        const posts = await Post.find({ })
      
        const formattedPosts = posts.map((post) => {
            return {  _id: post._id, title: post.title, desc: post.desc, likes: post.likes, comments: comments.filter((comment) => {
            
          console.log(comment.postId)
          console.log(JSON.stringify(post._id))
 
              return JSON.stringify(comment.postId) === JSON.stringify(post._id)
            }
			),createdAt: post.createdAt }
        })
        return res.status(200).json(formattedPosts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// get one
postController.get('/posts/:id', async(req, res) => {
    try {
       const post = await Post.findById(req.params.id)

       if(!post){
         return res.status(500).json({msg: "No such post with this id!"})
       } else {
        return res.status(200).json(post)
       }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})


//delete Post

postController.delete('/posts/:id', verifyToken, async(req, res) =>{
  try {
   const post = await Post.findById(req.params.id)

    if(!post){
      return res.status(500).json({msg: 'No such post'})
    } else if(post.userId !== req.user.id){
      return res.status(403).json({msg: 'You can delete only your own post'})
    } else{
      await Post.findByIdAndDelete(req.params.id)
      return res.status(200).json({msg: 'Post is successfully deleted'})
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

//like

postController.put('/like/:id', verifyToken, async(req, res) =>{
  try {
    
    const currentUserId = req.user.id
    const post = await Post.findById(req.params.id)

    if(!post.likes.includes(currentUserId)){
      post.likes.push(currentUserId)
      await post.save()
      return res.status(200).json({msg: 'successfully liked the post'})
    } 
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

//unlike
postController.put('/unlike/:id', verifyToken, async(req, res) =>{
  try {
    
    const currentUserId = req.user.id
    const post = await Post.findById(req.params.id)

    if(post.likes.includes(currentUserId)){
      post.likes = post.likes.filter((id) => id !== currentUserId)
      await post.save()
      return res.status(200).json({msg: 'successfully unliked the post'})
    } 
  } catch (error) {
    return res.status(500).json(error.message)
  }
})


module.exports = postController
