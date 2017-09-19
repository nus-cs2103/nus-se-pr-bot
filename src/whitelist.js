const path = require('path');
const StudentMapping = require('./StudentMapping');
const A = new StudentMapping(path.join(__dirname, '../data-A.csv'));
const B = new StudentMapping(path.join(__dirname, '../data-B.csv'));
const phaseMappings = { A, B };
const Validator = require('./src/Validator');

// Any repo that needs to be reviewed by a human should use this class
// i.e. this is a whitelist repo
module.exports = (accuser, account, repository) => {
  let validator = new Validator(accuser, account, repository);

  let filterBlock = (repo, issue) => {
    return issue.pull_request;
  };

  let doBlock = (repo, issue) => {
    const formatCheckLabel = 'FormatCheckRequested';
    const usernameCheckLabel = 'GithubUsernameRequested';
    const titlePattern = /^\s*\[W\d{1,2}\.\d{1,2}\D?\]\s*\[([WTF]\d{2})-([AB])(\d)\]/i;
    const titleCheckResult = Validator.checkTitle(issue.title, titlePattern);

    if (titleCheckResult === null) { // bad title
      validator.warn(issue,
        formatCheckLabel,
        'format-check-request.mst',
        {},
        `${account}/PR #${issue.number}: Bad title`
      );

      return;
    }

    if (Validator.hasLabel(issue, formatCheckLabel)) {
      validator.removeLabel(issue, formatCheckLabel);
    }

    const studentGithubId = issue.user.login;
    const phase = titleCheckResult[2];
    const dataMapping = phaseMappings[phase];
    const student = dataMapping.getInfoForStudent(studentGithubId);

    if (!student) {
      validator.warn(
        issue,
        usernameCheckLabel,
        'username-check-request.mst',
        `${account}/PR #${issue.number}: ${studentGithubId} not found`
      );

      return;
    }

    if (Validator.hasLabel(issue, usernameCheckLabel)) {
      validator.removeLabel(issue, usernameCheckLabel);
    }

    const reviewer = student.reviewer;
    const teamLabels = student.labels;

    validator.assign(issue, reviewer);
    validator.addLabels(issue, teamLabels);
  };

  validator.filterBlock = filterBlock;
  validator.doBlock = doBlock;
};
