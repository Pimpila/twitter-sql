'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
var client = require('../db');

// a reusable function
function respondWithAllTweets (req, res, next){

  client.query('SELECT name, content FROM tweets, users WHERE tweets.user_id = users.id', function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
  });

}

// here we basically treet the root view and tweets view as identical
router.get('/', respondWithAllTweets);
router.get('/tweets', respondWithAllTweets);

// single-user page
router.get('/users/:username', function(req, res, next){
  var username = req.params.username;

  client.query('SELECT name, content FROM tweets, users WHERE tweets.user_id = users.id', function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    var userTweets = []
    tweets.forEach(function(obj){
      if(obj.name === username){
        userTweets.push(obj)
      }

      // now userTweets is all of usernames tweets
    })
    res.render('index', { title: 'Twitter.js', tweets: userTweets, showForm: true });
  });

  // var tweetsForName = tweetBank.find({ name: req.params.username });
  // res.render('index', {
  //   title: 'Twitter.js',
  //   tweets: tweetsForName,
  //   showForm: true,
  //   username: req.params.username
  // });
});

// single-tweet page
router.get('/tweets/:id', function(req, res, next){
  var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
  res.render('index', {
    title: 'Twitter.js',
    tweets: tweetsWithThatId // an array of only one element ;-)
  });
});

// create a new tweet
router.post('/tweets', function(req, res, next){
  tweetBank.add(req.body.name, req.body.text);
  res.redirect('/');
});

// // replaced this hard-coded route with general static routing in app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });




module.exports = router;
