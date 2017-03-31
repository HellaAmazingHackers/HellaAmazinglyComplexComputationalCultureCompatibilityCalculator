var Analysis = require('../../database/models/analyses');
var AnalysesTrait = require('../../database/models/analyses_traits');
var tradeoff = require('./tradeoff');
var fs = require('fs');

// Example options array
// [
//   {
//     "key": "1",
//     "name": "Samsung Galaxy S4",
//     "values": {
//       "price": 249,
//       "weight": 130,
//       "brand": "Samsung",
//       "rDate": "2013-04-29T00:00:00Z"
//     }
//   },
//   {
//     "key": "2",
//     "name": "Apple iPhone 5",
//     "values": {
//       "price": 349,
//       "weight": 112,
//       "brand": "Apple",
//       "rDate": "2012-09-21T00:00:00Z"
//     }
//   }
// ]
var createOptions = function(callback) {
  return new Promise((resolve, reject) => {

    var options = [];

    var promises;
    // Query for the analyses we want (all public profiles FOR NOW)
    Analysis.find({private: false})
    .exec(function(err, analysesArray) {
      if (err) { 
        res.status(500).send(JSON.stringify({error: 'Databases failed to query'})); 
      } else if (analysesArray) {

        promises = analysesArray.map(function(analysis) {
          // return a promise for each analysis
          return new Promise((resolve, reject) => {
            // Set up key and name
            var obj = {
              key: analysis._id,
              name: analysis.person
            };

            // Set up values object
            var values = {};
            // Query analyses_traits for all traits with this analysis_id
            AnalysesTrait.find({analysis_id: analysis._id})
            .exec(function(err, analysisTraits) {
              if (err) {
                console.log('AnalysesTrait.find() err', err);
                reject(err);
              } else if (analysisTraits) {
                // Add each analysisTrait to the values object
                for (var j = 0; j < analysisTraits.length; j++) {
                  // TEMPORARILY FILTER to minimize results:
                  // Will only get big5 traits
                  // if (analysisTraits[j].trait_id.charAt(0) === 'b') {
                  //   values[analysisTraits[j].trait_id] = analysisTraits[j].percentile.valueOf() * 100;
                  // }
                  values[analysisTraits[j].trait_id] = analysisTraits[j].percentile.valueOf() * 100;
                }
              }
              obj.values = values;
              options.push(obj);
              // resolve(options);
              resolve();
            });
          });
        });
        // Promise.all(promises).then(() => callback(options));
        Promise.all(promises).then(() => resolve(options));
      }
    });
  });
};

const allTraitParams = [ 
  {key: 'big5_openness', goal: 'max', full_name: '[Big 5] Openness' },
  {key: 'big5_conscientiousness', goal: 'max', full_name: '[Big 5] Conscientiousness' },
  {key: 'big5_extraversion', goal: 'max', full_name: '[Big 5] Extraversion' },
  {key: 'big5_agreeableness', goal: 'max', full_name: '[Big 5] Agreeableness' },
  {key: 'big5_neuroticism', goal: 'max', full_name: '[Big 5] Neuroticism' },
  
  {key: 'facet_adventurousness', goal: 'max', full_name: '[Trait] Adventurousness' },
  {key: 'facet_artistic_interests', goal: 'max', full_name: '[Trait] Artistic Interests' },
  {key: 'facet_emotionality', goal: 'max', full_name: '[Trait] Emotionality' },
  {key: 'facet_imagination', goal: 'max', full_name: '[Trait] Imagination' },
  {key: 'facet_intellect', goal: 'max', full_name: '[Trait] Intellect' },
  {key: 'facet_liberalism', goal: 'max', full_name: '[Trait] Liberalism' },
  {key: 'facet_achievement_striving', goal: 'max', full_name: '[Trait] Achievement Striving' },
  {key: 'facet_cautiousness', goal: 'max', full_name: '[Trait] Cautiousness' },
  {key: 'facet_dutifulness', goal: 'max', full_name: '[Trait] Dutifulness' },
  {key: 'facet_orderliness', goal: 'max', full_name: '[Trait] Orderliness' },
  {key: 'facet_self_discipline', goal: 'max', full_name: '[Trait] Self Discipline' },
  {key: 'facet_self_efficacy', goal: 'max', full_name: '[Trait] Self Efficacy' },
  {key: 'facet_activity_level', goal: 'max', full_name: '[Trait] Activity Level' },
  {key: 'facet_assertiveness', goal: 'max', full_name: '[Trait] Assertiveness' },
  {key: 'facet_cheerfulness', goal: 'max', full_name: '[Trait] Cheerfulness' },
  {key: 'facet_excitement_seeking', goal: 'max', full_name: '[Trait] Excitement Seeking' },
  {key: 'facet_friendliness', goal: 'max', full_name: '[Trait] Friendliness' },
  {key: 'facet_gregariousness', goal: 'max', full_name: '[Trait] Gregariousness' },
  {key: 'facet_altruism', goal: 'max', full_name: '[Trait] Altruism' },
  {key: 'facet_cooperation', goal: 'max', full_name: '[Trait] Cooperation' },
  {key: 'facet_modesty', goal: 'max', full_name: '[Trait] Modesty' },
  {key: 'facet_morality', goal: 'max', full_name: '[Trait] Morality' },
  {key: 'facet_sympathy', goal: 'max', full_name: '[Trait] Sympathy' },
  {key: 'facet_trust', goal: 'max', full_name: '[Trait] Trust' },
  {key: 'facet_anger', goal: 'max', full_name: '[Trait] Anger' },
  {key: 'facet_anxiety', goal: 'max', full_name: '[Trait] Anxiety' },
  {key: 'facet_depression', goal: 'max', full_name: '[Trait] Depression' },
  {key: 'facet_immoderation', goal: 'max', full_name: '[Trait] Immoderation' },
  {key: 'facet_self_consciousness', goal: 'max', full_name: '[Trait] Self-Consciousness' },
  {key: 'facet_vulnerability', goal: 'max', full_name: '[Trait] Vulnerability' },

  {key: 'need_challenge', goal: 'max', full_name: '[Need] Challenge' },
  {key: 'need_closeness', goal: 'max', full_name: '[Need] Closeness' },
  {key: 'need_curiosity', goal: 'max', full_name: '[Need] Curiosity' },
  {key: 'need_excitement', goal: 'max', full_name: '[Need] Excitement' },
  {key: 'need_harmony', goal: 'max', full_name: '[Need] Harmony' },
  {key: 'need_ideal', goal: 'max', full_name: '[Need] Ideal' },
  {key: 'need_liberty', goal: 'max', full_name: '[Need] Liberty' },
  {key: 'need_love', goal: 'max', full_name: '[Need] Love' },
  {key: 'need_practicality', goal: 'max', full_name: '[Need] Practicality' },
  {key: 'need_self_expression', goal: 'max', full_name: '[Need] Self-Expression' },
  {key: 'need_stability', goal: 'max', full_name: '[Need] Stability' },
  {key: 'need_structure', goal: 'max', full_name: '[Need] Structure' },

  {key: 'value_conservation', goal: 'max', full_name: '[Value] Conservation' },
  {key: 'value_openness_to_change', goal: 'max', full_name: '[Value] Openness To Change' },
  {key: 'value_hedonism', goal: 'max', full_name: '[Value] Hedonism' },
  {key: 'value_self_enhancement', goal: 'max', full_name: '[Value] Enhancement' },
  {key: 'value_self_transcendence', goal: 'max', full_name: '[Value] Transcendence' }
];

// traitParams looks like defaultTraitParams above
var createColumns = function(traitParams) {
  return new Promise((resolve, reject) => {
    
    var columns = [];
    traitParams.forEach(function(trait) {
      var column = {
        'key': trait.key,
        'type': 'numeric',
        'goal': trait.goal,
        'is_objective': false,
        'full_name': trait.full_name,
        'range': {
          'low': 0,
          'high': 100
        },
        'format': 'number:0'
      };
      columns.push(column);
    });

    resolve(columns);
  });
};

// Problem object contains: subject, columns, and options
var createProblemObject = function() {

  return new Promise((resolve, reject) => {
    var problemObj = {
      subject: 'personalities', 
      columns: null, 
      options: null
    };

    var traitParams = allTraitParams;

    // Populate the Problem Object with columns and options properties
    createColumns(traitParams)
    .then(function(columns) {
      problemObj.columns = columns;
      return createOptions();
    })
    .then(function(options) {
      problemObj.options = options;

      // Send problem object to the Watson Tradeoff API
      // Note: Since we're using the widget, we don't need to make an API call from our server
      // tradeoff.getDilemma(problemObj);

      resolve(problemObj);
    });

  });
};

// TODO (Eddie): should differentiate based on twitter vs. resume analyses
// For now: only twitter
var writeProblemJSON = function() {

  return new Promise((resolve, reject) => {
    createProblemObject()
    .then(function(problemObj) {
      var filename = './client/dist/twitterProblem.json';
      fs.writeFile(filename, JSON.stringify(problemObj), (err) => {
        if (err) {
          reject();
          throw err;
        }
        console.log('The file ' + filename + ' has been saved!');
        resolve();
      });
    });
  });
};

module.exports.writeProblemJSON = writeProblemJSON;