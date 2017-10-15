const GitHubApi = require('github');
require('dotenv').config({ silent: true });

class Repository {
  constructor(accuser, account, repository) {
    this.accuser = accuser;
    this.account = account;
    this.repository = repository;
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
          reject(`Error retrieving the username for repo ${account}/${repository}.`);
          return;
        }

        const username = userData.data.login;
        const permissionParams = { owner: account, repo: repository, username };
        github.repos.reviewUserPermissionLevel(permissionParams,
          (permissionError, permissionData) => {
            if (permissionError) {
              reject(`Error retrieving permission information for repo ${account}/${repository}.`);
              return;
            }

            const validPermissions = ['admin', 'write'];
            if (!permissionData || !validPermissions.includes(permissionData.data.permission)) {
              reject(`Pr-bot does not have the required permissions for ${account}/${repository}.`);
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
    this.checkPermission()
      .then(() => console.log(`Pr-bot has the required permissions for ${account}/${repository}.`),
        error => console.log(error));
  }

  checkAndRun() {
    const self = this;
    this.checkPermission()
      .then(self.run, error => console.log(error));
  }
}

module.exports = Repository;
