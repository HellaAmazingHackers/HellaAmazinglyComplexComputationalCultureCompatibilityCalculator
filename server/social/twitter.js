var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
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

if (process.env.NODE_ENV === 'production') {
  console.log('in production');
  passport.use(new Strategy({
      consumerKey: API.twitterKey,
      consumerSecret: API.twitterSecret,
      callbackURL: 'https://hella-amazing-ccccc.herokuapp.com/twitter/return'
    },
    function(token, tokenSecret, profile, cb) {
      console.log(token, ' ', tokenSecret);
      client = populateClient(token, tokenSecret, profile.username);
      analyzeProfile(console.log);

      return cb(null, profile);
    })
  );
} else {
  passport.use(new Strategy({
      consumerKey: API.twitterKey,
      consumerSecret: API.twitterSecret,
      callbackURL: 'http://localhost:3000/twitter/return'
    },
    function(token, tokenSecret, profile, cb) {
      console.log(token, ' ', tokenSecret);
      client = populateClient(token, tokenSecret, profile.username);
      analyzeProfile(console.log);

      return cb(null, profile);
    })
  );
}


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
    console.log('erroring out in analyzeProfile before client.get');
    var tweetStrings = [];
    client.get('/statuses/user_timeline.json', 
      params, function(err, tweets, res) {
        if (err) {
          console.log('erroring out in analyzeProfile after client.get');
          console.log('error is: ', err);
          console.log('T1KEY: ', process.env.S1_KEY);
          reject(err);
        }
        else {
          tweets.forEach(function(tweet) {
            tweetStrings.push(tweet.text);
          });
          tweetStrings = tweetStrings.join(' ');
          resolve(JSON.stringify(tweetStrings));
        }
    });
  });
};

var testAnalysis = (req, res) => {
  var length = '/twitterProfile/'.length;
  var user = req.url.slice(length);
  analyzeProfile(function(tweets) {
    res.send(JSON.stringify(tweets));
  }, user);
}

var toAnalysis = function(req, res, next) {
  req.body = {
    name: '@' + req.user.username,
    context: 'twitter',
    private: true
  };
  next();
};

var renderTest = function(req, res) {
  res.render('testProfile', { user: req.user });
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
  req.params.username ? next() : res.redirect(301, '/selfTwitterAnalysis');
}

module.exports = {
  toAuth: passport.authorize('twitter'),
  fromAuth: passport.authorize('twitter', { failureRedirect: '/'}),
  analyzeProfile: analyzeProfile,
  testAnalysis: testAnalysis,
  toAnalysis: toAnalysis,
  renderTest: renderTest,
  follow: follow,
  tweet: tweet,
  attachUsername: attachUsername,
  checkIfSelfAnalysis: checkIfSelfAnalysis
}