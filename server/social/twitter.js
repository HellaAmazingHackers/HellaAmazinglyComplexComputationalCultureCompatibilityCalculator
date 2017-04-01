var passport = require('passport');
var TwitterStrategy = require('passport-twitter');
var Twitter = require('twitter');

var API = {
 twitterKey: process.env.TW_KEY,
 twitterSecret: process.env.TW_SECRET,
 access_token_key: process.env.TW_TOKEN,
 access_token_secret: process.env.TW_TOKEN_SECRET
};

var client = new Twitter({
 consumer_key: API.twitterKey,
 consumer_secret: API.twitterSecret,
 access_token_key: API.access_token_key,
 access_token_secret: API.access_token_secret
});

passport.use('twitter-authz', new TwitterStrategy({
    consumerKey: API.twitterKey,
    consumerSecret: API.twitterSecret,
    callbackURL: '/twitter/return',
  },
  function(token, tokenSecret, profile, cb) {
    client = populateClient(token, tokenSecret, profile.username);
    analyzeProfile(console.log);

    return cb(null, profile);
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Module.exports functions //


var populateClient = (token, tokenSecret, username) => {
  var client = new Twitter({
    consumer_key: API.twitterKey,
    consumer_secret: API.twitterSecret,
    access_token_key: token,
    access_token_secret: tokenSecret
  });

  client.username = username;

  return client;
};

var analyzeProfile = (username) => {
  return new Promise(function(resolve, reject) {
    username = username || client.username;
    var params = {
      screen_name: username,
      count: 200,
      exclude_replies: true
    };

    var tweetStrings = [];
    client.get('/statuses/user_timeline.json', 
      params, function(err, tweets, res) {
        if (err) reject(err);
        else {
          tweets.forEach(function(tweet) {
            tweetStrings.push(tweet.text);
          });
          tweetStrings = tweetStrings.join(' ');
          resolve(JSON.stringify(tweetStrings));
        }
    });
  })
}

var testAnalysis = (req, res) => {
  var length = '/twitterProfile/'.length;
  var user = req.url.slice(length);
  analyzeProfile(function(tweets) {
    res.send(JSON.stringify(tweets));
  }, user);
}

var toAnalysis = function(req, res, next) {
  let profile = req.session.profile
  req.body = {
    name: '@' + profile.username,
    context: 'twitter',
    private: true
  };
  next();
};

var follow = function(req, res, next) {
  var params = {
    screen_name: req.params.username
  };

  client.post('https://api.twitter.com/1.1/friendships/create.json', 
    params, function(err) {
      err ? res.status(500).send(err) : next();
  });
};

var tweet = function(req, res, par) {
  var params = {
    status: `I <3 ${req.params.username}!`
  };

  client.post('https://api.twitter.com/1.1/statuses/update.json', 
    params, function(err) {
      err ? res.status(500).send(err) : res.redirect('/Home');
  });
};

var twitterUsername;

var attachUsername = function(req, res, next) {
  // attaching params for tweeting
  if (req.url.indexOf('return') !== -1) {
    req.params.username = twitterUsername;
  } else {
    // saving global var in prep of return callback
    twitterUsername = req.query.username;
  }
  next();
}

var checkIfSelfAnalysis = function(req, res, next) {
  if (req.params.username) {
    next();
  } else {
    req.session.profile = req.account;
    res.redirect('/selfTwitterAnalysis');
  }
}

module.exports = {
  toAuth: passport.authorize('twitter-authz'),
  fromAuth: passport.authorize('twitter-authz', { failureRedirect: '/'}),
  analyzeProfile: analyzeProfile,
  testAnalysis: testAnalysis,
  toAnalysis: toAnalysis,
  follow: follow,
  tweet: tweet,
  attachUsername: attachUsername,
  checkIfSelfAnalysis: checkIfSelfAnalysis
}