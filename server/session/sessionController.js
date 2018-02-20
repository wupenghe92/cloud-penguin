const Session = require('./sessionModel');

const sessionController = {};

/**
* isLoggedIn - find the appropriate session for this request in the database, then
* verify whether or not the session is still valid.
*
*
*/
sessionController.isLoggedIn = (req, res, next) => {
  //getToken(req,res,next);
  const ssid = req.cookies.ssid;
  if (!ssid) {
    if (req.url === '/secret') return res.redirect('/signup');
    else return next();
  }
  //check session
  Session.find({cookieId: ssid}, (err, result) => {
    //console.log('ALL SESSIONS',result);
    if (result.length === 0) {
      if (req.url === '/secret') return res.redirect('/login');
      else return next();
    }
    if (req.url === '/secret') return next();
    else return res.redirect('/secret');
  });

};

/**
* startSession - create a new Session model and then save the new session to the
* database.
*/
sessionController.startSession = (req, res) => {
  //write code here
  Session.create({cookieId: res.locals._id}, (err, result) => {
    if (err) console.log('create session ERROR', err);
    // else console.log('create session result', result);
    return res.redirect('/secret');
  });
};

function getToken(req, res, next) {
  if (!req.url.includes('/secret?code')) return;
  const code = req.url.substring(8).split('=')[1];
}















module.exports = sessionController;
