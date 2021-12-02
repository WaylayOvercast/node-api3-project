const express = require('express');
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
const {
  logger,
  validateUserId,
  validateUser,
  validatePost
} = require('../middleware/middleware');
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  const users = await Users.get()
  if( !users ){
    res.status(500).json('no users found')
  }else{
    res.status(200).json(users)
  }
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  console.log(req.body)
  res.status(200).json(req.user);
});

router.post('/', validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  
  console.log(req.body.name) 
  Users.insert(req.body)
    .then(userId => {
      return Users.getById(userId.id)
    })
    .then(userObj => {
      res.status(201).json(userObj)
    })
  
});

router.put('/:id', validateUserId , validateUser, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body)
    .then(updatedUser => {
      res.status(201).json(updatedUser)
    })

});

router.delete('/:id', validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const identity = req.params.id
  const {id, name} = await Users.getById(identity); 
  Users.remove(identity)
    .then(xxx =>{
      console.log({id, name})
      res.status(204).json({...id, name:name})  //can someone explain this to me?? i need it lol..
    })

});

router.get('/:id/posts', validateUserId,(req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Users.getUserPosts(req.params.id)
    .then( posts =>{
      console.log(posts)
      res.status(200).json(posts)
    })
});

router.post('/:id/posts',validatePost, validateUserId, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Posts.insert({text: req.body.text, user_id: req.params.id})
    .then(post => {
      res.status(200).json(post)
    })
});

// do not forget to export the router
module.exports = router