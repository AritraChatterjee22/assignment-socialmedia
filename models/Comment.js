const mongoose = require('mongoose')

const CommentSchema =  mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  commentText: {
    type: String,
    required: true,
    min: 4,
  },
  //likes: {
  //  type: [String],
   // default: [],
  //}
}, {timestamps: true})

module.exports = mongoose.model("Comment", CommentSchema)
