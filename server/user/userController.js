const User = require('./userModel');
const cookieController = require('./../util/cookieController');
const sessionController = require('./../session/sessionController');
const fetch = require('node-fetch');
const https = require('https');
const userController = {};

/**
* getAllUsers
*
* @param next - Callback Function w signature (err, users)
*/
userController.getAllUsers = (next) => {
  User.find({}, next);
};

/**
* createUser - create a new User model and then save the user to the database.
*
* @param req - http.IncomingRequest
* @param res - http.ServerResponse
*/
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

/**
* verifyUser - Obtain username and password from the request body, locate
* the appropriate user in the database, and then authenticate the submitted password
* against the password stored in the database.
*
* @param req - http.IncomingRequest
* @param res - http.ServerResponse
*/
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



const cliend_secret = '0327aea3d6aca20bdaa9666770436d1f81ff2773';
const client_id = '4465665d856e7cc2e725';

userController.goToGithub = (req, res) => {
  const giturl = 'https://github.com/login/oauth/authorize?client_id=4465665d856e7cc2e725&scope=user&redirect_uri=http:\/\/localhost:3000/fromGithub';
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type,Authorization, Accept');
  res.redirect(giturl);
}



userController.getToken = (req, res, next) => {
  if (!req.url.includes('/fromGithub?code')) res.end('no code from github');
  const code = req.url.substring(12).split('=')[1];

  getTokenFromGithub(code, res)
    .then(useToken)
    .then(runNext)
    .catch(err => console.log(err));

  function runNext() {
    next();
  }
}

function useToken(res) {
  const cookieOption = {
    maxAge: 60000000,
    httpOnly: true
  };
  const cleanToken = {};
  const tokenVal = res.locals.token.split('&')[0].split('=')[1];
  const tokenType = res.locals.token.split('&')[2].split('=')[1];
  cleanToken.val = tokenVal;
  cleanToken.type = tokenType;
  res.cookie('githubToken', cleanToken, cookieOption);
  console.log('token', cleanToken);


  const optionsHttps = {
      hostname: 'api.github.com',//giturl,
      path: '/user',
      method: 'GET',
      headers: {'Content-Type' : 'application/json',
                'User-Agent'   : 'codesmith-unit-11-authentication',
                'Authorization': `token ${cleanToken.val}`
                }
    };
  let data = '';
  const getreq = https.request(optionsHttps, (response) => {
    response.on('error', () => {
      console.log('POST error');
    });
    response.on('data', (chunk) => {
      data += chunk.toString();
    });
    response.on('end', () => {
      console.log(JSON.parse(data));
    });
  });
  getreq.end();  // very important!!!
}
//   const giturl = `https://api.github.com/user?access_token=${cleanToken.val}`;
//   const optionsFetch = {
//     method: 'GET',
//     headers: {'User-Agent': 'codesmith-unit-11-authentication',
//               'Authorization': `token ${cleanToken.val}` }
//   };
//   fetch(giturl, optionsFetch)
//     .then( response => response.json())
//     .then( text => {
//       console.log('API-user',text);
//     })
//     .catch( err => {
//       console.log('fetchAPI failer', err);
//     });
// }



function getTokenFromGithub(code, res) {
  const client_secret = '0327aea3d6aca20bdaa9666770436d1f81ff2773';
  const client_id = '4465665d856e7cc2e725';
  const giturl = `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`;
  let token;
  const options1 = {
    method: 'POST',
    headers: {'Content-Type': 'text'}
  };
  return new Promise( (resolve, reject) => {
    fetch(giturl, options1)
      .then( response => response.text())
      .then( text => {
        res.locals.token = text;
        return resolve(res);
      })
      .catch( err => {
        console.log('fetch', err);
        return reject('err in getTokenFromGithub');
      });
  });
}

// function getTokenFromGithub(code,res) {
//   const client_secret = '0327aea3d6aca20bdaa9666770436d1f81ff2773';
//   const client_id = '4465665d856e7cc2e725';
//   const options = {
//     hostname: 'github.com',//giturl,
//     path: `/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
//     method: 'POST',
//     headers: {'Content-Type': 'text'},//{'Content-Type': ' application/x-www-form-urlencoded'},
//   };
//   let token;
//   const postreq = https.request(options, (response) => {
//     console.log('getting token');
//     response.on('error', () => {
//       console.log('POST error');
//       return;
//     });
//     response.on('data', (chunk) => {
//       token += chunk.toString();
//       console.log('chunk',chunk);
//     });
//     response.on('end', () => {
//       console.log(token);
//     });
//   });
//   //postreq.write();
//   postreq.end();
// }
module.exports = userController;
