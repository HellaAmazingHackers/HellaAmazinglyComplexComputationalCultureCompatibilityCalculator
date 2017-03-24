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

const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
const personalityInsights = new PersonalityInsightsV3({
  // If unspecified here, the PERSONALITY_INSIGHTS_USERNAME and
  // PERSONALITY_INSIGHTS_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided
  // VCAP_SERVICES environment property
  username: 'a9109e86-1887-485a-a447-c8743ea8a67d',
  password: 'y8nZT1zGw2CD',
  version_date: '2016-10-19',
});

const getProfile = (params) =>
  new Promise((resolve, reject) => {
    if (params.language) {
      params.headers = {
        'Content-Language': params.language,
      };
    }
    return personalityInsights.profile(params, (err, profile) => {
      if (err) {
        reject(err);
      } else {
        console.log('here it is', profile)
        resolve(profile);
      }
    });
  });

module.exports = {
  profileFromText: getProfile
};
