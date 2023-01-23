const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const authController = require('./controllers/auth')
const commentController = require('./controllers/comment')
const postController = require('./controllers/post')
const userController = require('./controllers/user')
const app = express()


//connect db
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, () => console.log('DB is connected'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api', authController)
app.use('/api', userController)
app.use('/api', postController)
app.use('/api', commentController)

//connect server

app.listen(process.env.PORT, () => console.log('Server is connected'))

