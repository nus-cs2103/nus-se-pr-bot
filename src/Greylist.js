const Validator = require('./Validator');
const util = require('./utility');
const Repository = require('./Repository');
const semesterAccount = require('../config').semesterAccount;

// Closes the PR if it fulfills the title check pattern
// Bad title PR from students will fall through
class Greylist extends Repository {
  run() {
    const { validator } = this;

    let filterBlock = (repo, issue) => {
      return issue.pull_request;
    };

    let doBlock = (repo, issue) => {
      const titlePattern = util._titleRegex;
      const titleCheckResult = Validator.checkTitle(issue.title, titlePattern);

      if (titleCheckResult) {
        // Assume student PR
        validator.comment(issue, 'wrong-repository.mst', { semesterAccount });
        validator.close(issue);
      }
    };

    validator.filterBlock = filterBlock;
    validator.doBlock = doBlock;
  }
}

module.exports = Greylist;
