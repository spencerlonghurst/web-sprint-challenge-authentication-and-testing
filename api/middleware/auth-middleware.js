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
  console.log(req.body.username)
  if (!req.body.username.trim() || typeof req.body.username !== 'string') {
    next({ status: 400, message: 'username and password required' })
  } else if (!req.body.password.trim() || typeof req.body.password !== 'string') {
    next({ status: 400, message: 'username and password required' })
  } else {
    req.user = {
      username: req.body.username, 
      password: req.body.password,
    }
    next()
  }
}



module.exports = {
  checkUsernameFree,
  checkCredentials,
}