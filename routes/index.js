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
   client.query('SELECT name, content FROM tweets, users WHERE users.id = tweets.id AND users.name = $1', [username], function (err, result) {
    if (err) return next(err); // pass errors to Express
    var tweets = result.rows;
    res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
  });
});


// single-tweet page
router.get('/tweets/:id', function(req, res, next){
  var id = Number(req.params.id);

  client.query('SELECT * FROM tweets WHERE id = $1', [id], function(err, result){
    if(err) return next(err);
    var tweets = result.rows;
    res.render('index',  {title: 'Twitter.js', tweets: tweets, showForm: true });
  });

});

// create a new tweet
router.post('/tweets', function(req, res, next){
  var tweeter = req.body.name;
  var text = req.body.text;

  client.query('SELECT id FROM users WHERE name = $1,' [req.body.name], function (err, result) {
    if(err) return next(err);
    var tweets = result.rows;
    if(tweets.length){
      // var tweet = result.rows;
      // post tweet under id
      client.query('INSERT into tweets (user_id, content) VALUES $1, $2', [tweet.id, text], function(err, result){
        if(err) return next(err);
        console.log('user tweeted again', result);
      });
    }else{
      client.query('INSERT into users (name) VALUES $1', [tweeter], function(err, result){
        if(err) return next(err);
        console.log('new user tweeted', result);
      });
      client.query('INSERT into tweets (user_id, content) VALUE $1 $2', [users.id, text], function(err, result){
        if(err) return next(err);
        console.log('new user tweeted', result);
      });
      client.end();
      res.redirect('/');
    }
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
