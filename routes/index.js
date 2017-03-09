'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
var client = require('../db');

// a reusable function
function respondWithAllTweets (req, res, next){

  client.query('SELECT name, content, tweets.id FROM tweets, users WHERE tweets.user_id = users.id', function (err, result) {
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
  var username = req.params.username
   client.query('SELECT name, content FROM tweets, users HAVING users.name = "' + username + '" ', function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    console.log(tweets);
    // var userTweets = []
    // tweets.forEach(function(obj){
    //   if(obj.name === username){
    //     userTweets.push(obj)
    //   }
      // now userTweets is all of usernames tweets
    // });
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
  });
});
  // client.query('SELECT name, content FROM tweets, users WHERE tweets.user_id = users.id', function (err, result) {
  //   if (err) return next(err); // pass errors to Express
  //   var tweets = result.rows;
  //   var userTweets = []
  //   tweets.forEach(function(obj){
  //     if(obj.name === username){
  //       userTweets.push(obj)
  //     }
  //     // now userTweets is all of usernames tweets
  //   });
  //   res.render('index', { title: 'Twitter.js', tweets: userTweets, showForm: true });
  // });
// });

// single-tweet page
router.get('/tweets/:id', function(req, res, next){
  var id = Number(req.params.id);

  client.query('SELECT * FROM tweets', function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    var tweetByID = [];
    tweets.forEach(function(obj){
      if(obj.id === id){
        tweetByID.push(obj);
      }
    });
      res.render('index', { title: 'Twitter.js', tweets: tweetByID, showForm: true });
  });
});

// create a new tweet
router.post('/tweets', function(req, res, next){
  client.query('SELECT id  FROM users WHERE name = req.body.name', function (err, result) {
    if(err) return next(err);
    // if (result), INSERT the tweet under exisitng id
    //if(req.body.name === )
    // else: INSERT new user and new gtweet

  // tweetBank.add(req.body.name, req.body.text);
  // res.redirect('/');
  })
});

// // replaced this hard-coded route with general static routing in app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });




module.exports = router;
