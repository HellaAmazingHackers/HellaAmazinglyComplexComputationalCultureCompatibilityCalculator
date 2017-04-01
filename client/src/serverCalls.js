import axios from 'axios';

var routes = {
    public: '/publicanalyses',
    customform: '/analysis',
    twitter: '/twitter',
    twitterProfile: '/analysis',
    analyze: '/analyze/',
    user: '/useranalyses',
    checkLoggedIn: '/LoggedIn',
    userData: '/userData'
}

const serverPost = (routeName, message) => {
  return axios.post(routes[routeName], message);
};

const analysesGet = (id) => {
  return axios.get(routes['analyze'] + id);
};

const customGet = (routeName) => {
  return axios.get(routeName);
};

const serverGet = (routeName) => {
  return axios.get(routes[routeName]);
};

export {customGet, serverPost, serverGet, analysesGet};

