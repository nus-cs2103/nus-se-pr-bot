const path = require('path');
const StudentMapping = require('./StudentMapping');
const A = new StudentMapping(path.join(__dirname, '../data-A.csv'));
const B = new StudentMapping(path.join(__dirname, '../data-B.csv'));
const phaseMappings = { A, B };
const Validator = require('./Validator');
const util = require('./utility');
const Repository = require('./Repository');

// Any repo that needs to be reviewed by a human should use this class
// i.e. this is a whitelist repo
class Whitelist extends Repository {
  run() {
    const { accuser, account, repository } = this;
    let validator = new Validator(accuser, account, repository);

    let filterBlock = (repo, issue) => {
      return issue.pull_request;
    };

    let doBlock = (repo, issue) => {
      const formatCheckLabel = 'FormatCheckRequested';
      const usernameCheckLabel = 'GithubUsernameRequested';
      const studentGithubId = issue.user.login;
      const titlePattern = util._titleRegex;
      const titleCheckResult = Validator.checkTitle(issue.title, titlePattern);

      if (titleCheckResult === null) { // bad title
        validator.warn(
          issue,
          formatCheckLabel,
          'format-check-request.mst',
          { username: studentGithubId },
          `${account}/${repository}/PR #${issue.number}: Bad title`
        );

        return;
      }

      if (Validator.hasLabel(issue, formatCheckLabel)) {
        validator.removeLabel(issue, formatCheckLabel);
      }

      const phase = titleCheckResult[2];
      const dataMapping = phaseMappings[phase];
      const student = dataMapping.getInfoForStudent(studentGithubId);

      if (!student) {
        validator.warn(
          issue,
          usernameCheckLabel,
          'username-check-request.mst',
          { username: studentGithubId },
          `${account}/${repository}/PR #${issue.number}: ${studentGithubId} not found`
        );

        return;
      }

      if (Validator.hasLabel(issue, usernameCheckLabel)) {
        validator.removeLabel(issue, usernameCheckLabel);
      }

      const reviewer = student.reviewer;
      const teamLabels = student.labels;

      validator.assign(issue, reviewer);
      teamLabels.forEach(label => validator.addUniqueLabel(issue, label));
    };

    validator.filterBlock = filterBlock;
    validator.doBlock = doBlock;
  }
}

module.exports = Whitelist;
