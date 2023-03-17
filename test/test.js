const chai = require("chai");
let chaiHttp = require('chai-http');
const { response } = require("express");

let comment = require('../controllers/comment')
let post = require('../controllers/post')
let user = require('../controllers/user')

chai.should();
chai.use(chaiHttp);

describe('App unit testing',()=>{
  describe('Get Post unit testing',()=>{
    it('Get all Post',(done)=>{
      chai.request(post).get('/all_posts').end((err,response)=>{
        if(err) console.log(err)
        else{
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.should.have.property('_id');
          response.body.should.have.property('title');
          response.body.should.have.property('desc');
          response.body.should.have.property('likes');
          response.body.should.have.property('comments');
        }
      })
      done();
    })
  describe('Get user unit testing',()=>{
    it('Get user',(done)=>{
      chai.request(user).get('/user').end((err,response)=>{
        if(err) console.log(err)
        else{
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('followers');
          response.body.should.have.property('followings');
        }
      })
      done();
    })
  })
})
  
  describe(' Post unit testing',()=>{
    it('Create a new post',(done)=>{
      const postData = {
        title: 'sample title',
        desc: 'sample desc'
      }
      chai.request(post).post('/posts').send(postData).end((err,response)=>{
        if(err) console.log(err)
        else{
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('PostId');
          response.body.should.have.property('Title');
          response.body.should.have.property('Description');
        }
      })
      done();
    })
})
})
