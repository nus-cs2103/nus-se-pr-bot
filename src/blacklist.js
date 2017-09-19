const path = require('path');
const StudentMapping = require('./StudentMapping');
const A = new StudentMapping(path.join(__dirname, '../data-A.csv'));
const B = new StudentMapping(path.join(__dirname, '../data-B.csv'));
const phaseMappings = { A, B };
const Validator = require('./src/Validator');

// Handles blacklisted repository
// Any PRs will be closed automatically
module.exports = (accuser, account, repository, commentTemplate) => {
  let validator = new Validator(accuser, account, repository);

  let filterBlock = (repo, issue) => {
    return issue.pull_request;
  };

  let doBlock = (repo, issue) => {
    validator.comment(issue, commentTemplate);
    validator.close(issue);
  };

  validator.filterBlock = filterBlock;
  validator.doBlock = doBlock;
};
