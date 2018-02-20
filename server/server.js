const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const cookieController = require('./cookie/cookieController');
// const userController = require('./user/userController');


const app = express();

// const mongoURI =  'mongodb://localhost/cloudPenguin';
// mongoose.connect(mongoURI);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req,res,next)=>{
  console.log(req.method, req.url);
  next();
});

app.get('/',  cookieController.isLoggedIn, (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname , './../client/login.html'));
});
app.get('/login.css', (req, res) => {
  res.set("Content-Type", "text/css; charset=utf-8");
  res.sendFile(path.join(__dirname , './../client/login.css'));
});
app.get('/signup', (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname , './../client/signup.html'));
});
//
// app.post('/signup', userController.createUser,
//                     cookieController.setSSIDCookie,
//                     sessionController.startSession);
//
// app.post('/login', sessionController.isLoggedIn,
//                    userController.verifyUser,
//                    cookieController.setSSIDCookie,
//                    sessionController.startSession);
//



app.listen(3000);
