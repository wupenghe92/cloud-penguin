const User = require('./../user/userModel');

const cookieController = {};
cookieController.isLoggedIn = isLoggedIn;
cookieController.setSSIDCookie = setSSIDCookie;


function isLoggedIn(req, res, next) {
  const ssid = req.cookies.ssid;
  if (!ssid) return next();
  User.find({cookieId: ssid}, (err, result) => {
    if (result.length === 0) return next();
    else return next();   //res.redirect('/secret');
  });
}


function setSSIDCookie(req, res, next) {
  const option = {
    maxAge: 600000000,
    httpOnly: true
  };
  res.cookie('ssid', res.locals._id, option);
  return res.redirect('/kimi');
}

module.exports = cookieController;
