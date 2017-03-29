var TradeoffAnalyticsV1 = require('watson-developer-cloud/tradeoff-analytics/v1');
var tradeoffAnalytics = new TradeoffAnalyticsV1({
  username: process.env.T_A_USERNAME,
  password: process.env.T_A_PASSWORD
});

// Parameters for the call are defined in the problem.json file.
// var params = require('problem.json');

var getDilemma = function(params) {
  tradeoffAnalytics.dilemmas(params, function(error, resolution) {
    if (error) {
      console.log('Error in getDilemma:', error);
    } else {
      console.log('getDilemma resolution: ', JSON.stringify(resolution, null, 2));
      // Store the dilemma we get back in the database

      
    }
  });
};

module.exports.getDilemma = getDilemma;