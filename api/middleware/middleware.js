const Posts = require ('../posts/posts-model');
const Users = require ('../users/users-model');


function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(req.body)
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const user = await Users.getById(req.params.id);
    if (user) {
      req.user = user; 
      next();
    } else {
      next(res.status(404).json({message:'not found'}));
    }
  } catch (error) {
    next(error);
  }

}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  !req.body.name|| !req.body.name.trim()
                            ?
  next(res.status(400).json({message: 'missing required name field'}))
                            :next()
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
};