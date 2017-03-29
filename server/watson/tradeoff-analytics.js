/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const TradeoffAnalyticsV1 = require('watson-developer-cloud/tradeoff-analytics/v1');

const tradeoff_analytics = new TradeoffAnalyticsV1({
  username: process.env.T_A_USERNAME,
  password: process.env.T_A_PASSWORD
});

// SAMPLE DATA FROM FILE
const params = require('../../database/problem.json');

tradeoff_analytics.dilemmas(params, function(err, res) {
  if (err) {
    console.log(err);
  } else {
    console.log(JSON.stringify(res, null, 2));
  }
});
