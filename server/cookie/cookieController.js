const User = require('./../user/userModel');

const cookieController = {};
cookieController.isLoggedIn = isLoggedIn;
cookieController.setSSIDCookie = setSSIDCookie;


function isLoggedIn(req, res, next) {
  const ssid = req.cookies.ssid;
  if (!ssid) {
    if (req.url === '/kimi') return res.redirect('/');
  }
  User.find({_id: ssid}, (err, result) => {
    if (err || result.length === 0) return res.redirect('/');
    return next();
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
