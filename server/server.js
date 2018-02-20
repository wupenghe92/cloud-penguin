const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const userController = require('./user/userController');
const cookieController = require('./util/cookieController');
const sessionController = require('./session/sessionController');

const app = express();

const mongoURI =  'mongodb://localhost/cloudPenguin';
mongoose.connect(mongoURI);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req,res,next)=>{
  console.log(req.method, req.url);
  next();
})

app.get('/', cookieController.isloggedIn, (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname , './../client/login.html'));
});

app.get('/signup', (req, res) => {
  res.render('./../client/signup', {error: null});
});

app.post('/signup', userController.createUser,
                    cookieController.setSSIDCookie,
                    sessionController.startSession);

app.post('/login', sessionController.isLoggedIn,
                   userController.verifyUser,
                   cookieController.setSSIDCookie,
                   sessionController.startSession);

app.get('/secret', sessionController.isLoggedIn, showSecretPage);

app.get('/github', userController.goToGithub);

app.get('/fromGithub', userController.getToken , showSecretPage);



app.listen(3000);

module.exports = app;
