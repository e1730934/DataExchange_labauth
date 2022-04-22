const basicInfo = require('./basicInfo');
const servers = require('./servers');
const tags = require('./tags');
const components = require('./components');
const users = require('./users');

module.exports = {
    ...basicInfo,
    ...servers,
    ...tags,
    ...components,
    ...users
};


