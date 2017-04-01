var mongoose = require('mongoose');

var ProblemSchema = mongoose.Schema({
  problem: Object
});

var Problem = mongoose.model('Problem', ProblemSchema);

module.exports = Problem;