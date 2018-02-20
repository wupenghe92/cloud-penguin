
const sessionController = require('./../session/sessionController');

const cookieController = {};
cookieController.setCookie = setCookie;
cookieController.setSSIDCookie = setSSIDCookie;




function setSSIDCookie(req, res, next) {
  const option = {
    maxAge: 600000000,
    httpOnly: true
  };
  res.cookie('ssid', res.locals._id, option);
  next();
}














module.exports = cookieController;
