const Validator = require('./Validator');
const Repository = require('./Repository');

// Handles blacklisted repository
// Any PRs will be closed automatically
class Blacklist extends Repository {
  run() {
    const { accuser, account, repository } = this;
    const validator = new Validator(accuser, account, repository);

    const filterBlock = (repo, issue) => {
      return issue.pull_request;
    };

    const doBlock = (repo, issue) => {
      validator.comment(issue, 'practice-fork.mst');
      validator.close(issue);
    };

    validator.filterBlock = filterBlock;
    validator.doBlock = doBlock;
  }
}

module.exports = Blacklist;
