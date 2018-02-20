const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const cookieController = require('./cookie/cookieController');
const userController = require('./user/userController');


const app = express();

const mongoURI =  'mongodb://localhost/cloudPenguin';
mongoose.connect(mongoURI);

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

app.get('/kimi', (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname , './../client/kimi.html'));
});

app.get('/img/kimi.jpg', (req, res) => {
  res.sendFile(path.join(__dirname , './../img/kimi.jpg'));
});



app.post('/signup', userController.createUser,
                    cookieController.setSSIDCookie);

app.post('/login', userController.verifyUser,
                   cookieController.setSSIDCookie);




app.listen(3000);
