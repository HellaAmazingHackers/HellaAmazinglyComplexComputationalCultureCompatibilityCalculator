var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var watsonHelpers = require('./watson/watson-helpers');
var tradeoffHelpers = require('./watson/watson-tradeoff-helpers');
var taWidget = require('./watson/tradeoff-analytics-config');
var passport = require('passport');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn();
var tw = require('./social/twitter.js');
var db = require('../database/config');
var dbHelpers = require('../database/helpers/request_helpers');
var path = require('path');
var Auth0Strategy = require('./social/auth0');
var Auth0Helpers = require('./Helpers/Auth0Helpers');

//-------------------------------------------------------------//

var app = express();

app.use(express.static(__dirname + '/../client/dist'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const secret = "Jeff has a secret you cannot guess what it is!";
app.use(cookieParser(secret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({secret: secret, resave: true, saveUnitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

/**********************/
/**** TA Widget Setup ****/
/**********************/

// For local development, copy your service instance credentials here, otherwise you may ommit this parameter
var serviceCredentials = {
  username: process.env.T_A_USERNAME,
  password: process.env.T_A_PASSWORD
}
// When running on Bluemix, serviceCredentials will be overriden by the credentials obtained from VCAP_SERVICES
taWidget.setupToken(app, serviceCredentials); 

/**********************/
/**** SOCIAL MEDIA ****/
/**********************/

app.get('/twitter', tw.toAuth);
app.get('/twitter/return', tw.fromAuth, tw.toAnalysis, 
  watsonHelpers.analyzeProfile);
app.get('/twitterProfile/*', tw.testAnalysis);

/****************/
/**** WATSON ****/
/****************/

app.post('/analysis', watsonHelpers.analyzeProfile);

/****************/
/**** Auth0 ****/
/****************/

app.get('/AuthLogin', Auth0Helpers.renderLoginWidget);

app.get('/AuthLogout', Auth0Helpers.logout);

app.get('/LoggedIn', Auth0Helpers.isLoggedIn);

app.get('/callback', Auth0Helpers.pAuth, Auth0Helpers.successRedirect);

app.get('/userData', Auth0Helpers.getUserData);

/****************/
/**** NATIVE ****/
/****************/

app.get('/analyze/*', dbHelpers.findAllDataFromAnAnalysis); 
app.get('/publicanalyses', dbHelpers.getPublicAnalyses);
app.get('/useranalyses', dbHelpers.getUserAnalyses);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});



app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port 3000.');
});
