const express = require('express');
const path = require('path');
const kimiModel = require('./../penguin/kimiModel');
const userController = require('./user/userController');
const cookieController = require('./cookie/cookieController');
const kimiRouter = express.Router();


kimiRouter.get('/', cookieController.isLoggedIn, (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname , './../client/kimi.html'));
});
kimiRouter.get('/kimi.jpg', (req, res) => {
  res.sendFile(path.join(__dirname , './../penguin/img/kimi.jpg'));
});

kimiRouter.get('/playing', (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname , './../client/playing.html'));
});

kimiRouter.get('/kimiPlaying.jpg', (req, res) => {
  res.sendFile(path.join(__dirname , './../penguin/img/kimiPlaying.jpg'));
});


kimiRouter.post('/feed', userController.getUserInfo, userController.feed);

kimiRouter.post('/play', userController.getUserInfo, userController.play);

kimiRouter.get('/info', userController.findAll, userController.sendInfo);



module.exports = kimiRouter;
