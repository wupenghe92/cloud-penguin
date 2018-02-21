const User = require('./userModel');
const kimi = require('./../../penguin/kimiModel');
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



userController.feed = function(req, res) {
  const food = req.body.food;
  const user = res.locals.user;
  // console.log(food, kimi)
  const prevsHappiness = kimi.happiness;
  kimi.feed(food);
  const currHappiness = kimi.happiness;
  const fnChange = currHappiness - prevsHappiness;
  userUpdate(user, fnChange)
  // res.jsonp(food);
  .then( ()=>{res.redirect('/kimi')});
};


userController.play = function(req, res) {
  const user = res.locals.user;
  // const prevsHappiness = kimi.happiness;
  // kimi.play(user.friendliness);
  // const currHappiness = kimi.happiness;
  // const fnChange = currHappiness - prevsHappiness;
  // userUpdate(user, fnChange);

  res.redirect('/kimi/playing');
};



userController.getUserInfo = function(req, res, next) {
  const _id = req.cookies.ssid;
  User.find({_id:_id}, (err, result) => {
    if (err) {
      console.log('can\'t find user')
      return next();
    }
    res.locals.user = result[0];
    return next();
  });
};


function userUpdate(user, fnChange) {
  const newfn = user.friendliness + fnChange;
  // console.log('userID',user);
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({_id: user._id}, {friendliness: newfn},(err, result) => {
      if (err) {
        console.log('fail to update');
        reject(err);
      }
      console.log('update result',result);
      resolve();
    });

  });

};





// userController.findAll = function(req, res, next) {
//   User.find({}, (err, result) => {
//     res.locals.alluser = result;
//     next();
//   })
// };



module.exports = userController;
