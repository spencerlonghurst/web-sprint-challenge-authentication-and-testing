const User = require('../users/users-model')

async function checkUsernameFree(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (!users.length) {
      next()
    } else {
      next({ status: 422, message: 'username taken' })
    }
  } catch (err) {
    next(err)
  }
}

function checkCredentials (req, res, next) {
  if (!req.body.username) {
    next({ status: 400, message: 'username and password required' })
  } else if (!req.body.password) {
    next({ status: 400, message: 'username and password required' })
  } else {
    req.user = {
      username: req.body.username, 
      password: req.body.password,
    }
  }
}



module.exports = {
  checkUsernameFree,
  checkCredentials,
}