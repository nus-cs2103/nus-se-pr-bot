const Promise = require('bluebird');
const GitHubApi = require('github');
require('dotenv').config({ silent: true });

const castStreamToString = (stream) => {
  let promise = new Promise((resolve, reject) => {
    let s = '';
    stream.on('data', data => { s += data.toString(); });
    stream.on('end', () => resolve(s));
    stream.on('error', reject);
  });
  return promise;
};

const checkHaveValidPermission = (owner, repo) => {
  let promise = new Promise(resolve => {
    const github = new GitHubApi({});
    const githubAuth = {
      type: 'oauth',
      token: process.env.GITHUB_TOKEN
    };

    github.authenticate(githubAuth);
    github.users.get({}, (_, userData) => {
      const username = userData.data.login;
      const permissionParams = { owner, repo, username };
      github.repos.reviewUserPermissionLevel(permissionParams, (__, permissionData) => {
        const validPermissions = ['admin', 'write'];
        if (permissionData && validPermissions.includes(permissionData.data.permission)) {
          resolve();
        }
      });
    });
  });
  return promise;
};

module.exports = {
  _titleRegex: /^\s*\[W\d{1,2}\.\d{1,2}\D?\]\s*\[([WTF]\d{2})-([AB])(\d)\]/i,
  _rcsTitleRegex: /^Add(ing|ed){0,1}\s.+\.txt/i,
  castStreamToString: castStreamToString,
  checkHaveValidPermission: checkHaveValidPermission
};
