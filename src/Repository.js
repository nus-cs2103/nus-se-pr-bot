const GitHubApi = require('@octokit/rest');
const Promise = require('bluebird');
require('dotenv').config({ silent: true });

// Implements methods to check the required permissions for a repo
// Classes that extends this class should implement the `run` method
class Repository {
  constructor(accuser, account, repository, validator) {
    this.accuser = accuser;
    this.account = account;
    this.repository = repository;
    this.validator = validator;
  }

  checkPermission() {
    const { account, repository } = this;
    const promise = new Promise((resolve, reject) => {
      const github = new GitHubApi({});
      const githubAuth = {
        type: 'oauth',
        token: process.env.GITHUB_TOKEN
      };

      github.authenticate(githubAuth);
      github.users.get({}, (userError, userData) => {
        if (userError) {
          reject(new Error(`Error retrieving the username for repo ${account}/${repository}.`));
          return;
        }

        const username = userData.data.login;
        const permissionParams = { owner: account, repo: repository, username };
        github.repos.reviewUserPermissionLevel(permissionParams,
          (permissionError, permissionData) => {
            if (permissionError) {
              reject(new Error(`Error retrieving permission information for repo ${account}/${repository}.`));
              return;
            }

            const validPermissions = ['admin', 'write'];
            if (!permissionData || !validPermissions.includes(permissionData.data.permission)) {
              reject(new Error(`Pr-bot does not have the required permissions for ${account}/${repository}.`));
              return;
            }

            resolve();
          });
      });
    });
    return promise;
  }

  dryCheck() {
    const { account, repository } = this;
    const promise = new Promise((resolve, reject) => {
      this.checkPermission()
        .then(() => {
          console.log(`Pr-bot has the required permissions for ${account}/${repository}.`);
          resolve();
        }, error => {
          console.log(error.message);
          reject(error);
        });
    });
    return promise;
  }

  checkAndRun() {
    const promise = new Promise((resolve, reject) => {
      this.checkPermission()
        .then(() => {
          this.run.apply(this);
          console.log(`Do & Filter blocks added for repo ${this.account}/${this.repository}`);
          resolve();
        }, error => {
          console.log(error.message);
          reject(error);
        });
    });
    return promise;
  }
}

module.exports = Repository;
