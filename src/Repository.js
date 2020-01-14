const GitHubApi = require('@octokit/rest');

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
    return new Promise((resolve, reject) => {
      const github = new GitHubApi({
        auth: process.env.GITHUB_TOKEN
      });

      github.users.getAuthenticated().then(resp => {
        const username = resp.data.login;

        // Checks permission for this repository.
        github.repos.getCollaboratorPermissionLevel({
          owner: account,
          repo: repository,
          username
        }).then(resp2 => {
          const validPermissions = ['admin', 'write'];
          if (validPermissions.includes(resp2.data.permission)) {
            resolve();
            return;
          }
          const err = new Error(`Pr-bot does not have the required permissions for ${account}/${repository}.`);
          console.log(err);
          reject(err);
        }, err => {
          console.log(`Error retrieving permission information for repo ${account}/${repository}.`);
          reject(err);
        });
      }, err => {
        console.log(`Error retrieving the username for repo ${account}/${repository}.`);
        reject(err);
      });
    });
  }

  dryCheck() {
    const { account, repository } = this;
    return new Promise((resolve, reject) => {
      this.checkPermission()
        .then(() => {
          console.log(`Pr-bot has the required permissions for ${account}/${repository}.`);
          resolve();
        }, error => {
          console.log(error.message);
          reject(error);
        });
    });
  }

  checkAndRun() {
    return new Promise((resolve, reject) => {
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
  }
}

module.exports = Repository;
