const User = require('./userModel');
const cookieController = require('./../util/cookieController');
const sessionController = require('./../session/sessionController');
const fetch = require('node-fetch');
const https = require('https');
const userController = {};


userController.createUser = (req, res, next) => {
  // console.log(req.body);
  const newUser = new User(req.body);

  newUser.save((err, result) => {
    if (err) {
      console.log('SignUp ERR', err);
      return res.render('./../client/signup', {error: err});
    }
    res.locals._id = result._id;
    console.log('sign up result', result);
    next();
  });
};


userController.verifyUser = (req, res, next) => {
  //console.log('req.body=',req.body);
  const user = {username: req.body.username};
  const plainPassword = req.body.password;
  User.find(user, (err, result) => {
    if (result.length === 0) {
      console.log('Login ERR--no username found');
      return res.redirect('/signup');
    }
    if (result[0].comparePassword(plainPassword)) {
      res.locals._id = result[0]._id;
      next();
    } else {
      console.log('password incorrect');
      return res.redirect('/signup');
      // return res.redirect('/login');
    }
  });
};






module.exports = userController;
