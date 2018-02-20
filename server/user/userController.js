const User = require('./userModel');

const userController = {};


userController.createUser = function(req, res, next) {
  console.log('body',req.body);
  const newUser = new User(req.body);

  newUser.save((err, result) => {
    if (err) {
      console.log('SignUp ERR', err);
      return res.redirect('/signup');
    }
    res.locals._id = result._id;
    console.log('sign up result', result);
    next();
  });
};


userController.verifyUser = function(req, res, next) {
  const user = {username: req.body.username};
  const plainPassword = req.body.password;
  User.find(user, (err, result) => {
    if (result.length === 0) {
      console.log('Login ERR--no username found');
      return res.redirect('/');
    }
    if (result[0].comparePassword(plainPassword)) {
      res.locals._id = result[0]._id;
      return next();
    } else {
      console.log('password incorrect');
      return res.redirect('/');
    }
  });
};

userController.findAll = function(req, res, next) {
  User.find({}, (err, result) => {
    res.locals.alluser = result;
    next();
  })
}




module.exports = userController;
