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
  const prevsHappiness = kimi.happiness;
  kimi.feed(food);
  const currHappiness = kimi.happiness;
  const change = {
    friendliness: user.friendliness + currHappiness - prevsHappiness,
  }
  userUpdate(user, change)
  // res.jsonp(food);
  .then(()=>{res.redirect('/kimi')});
};


userController.play = function(req, res) {
  const user = res.locals.user;
  if (kimi.busy) {
    if (chanceToSteal(user.friendliness)) {
      kimi.play(user);
      return res.redirect('/kimi/playing');
    } else {
      console.log('kimi doesn\'t want to play with user.username')
      return res.redirect('/kimi');
    }
  }
  kimi.play(user);
  console.log(user.username, user.friendliness);
  // console.log(kimi);
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
    console.log(res.locals.user);
    // console.log(kimi);
    return next();
  });
};


function userUpdate(user, change) {
  // console.log('userID',user);
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({_id: user._id}, change ,(err, result) => {
      if (err) {
        console.log('fail to update');
        reject(err);
      }
      console.log('update successful');
      resolve();
    });
  });
}




function chanceToSteal(friendliness) {
  if (friendliness < kimi.currUserFn + 10) return false;
  const prob = Math.round((1 - (9/(friendliness - kimi.currUserFn)))*100);
  const rand = 100*(Math.random());
  // console.log(`prob=${prob}%, rand=${rand}%`);
  return prob > rand;
}
// userController.findAll = function(req, res, next) {
//   User.find({}, (err, result) => {
//     res.locals.alluser = result;
//     next();
//   })
// };



module.exports = userController;
