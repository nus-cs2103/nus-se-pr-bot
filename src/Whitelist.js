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

      // this is to catch students using phase A team for some W6 LOs in level 3
      const week6TitlePattern = /W6/i;
      const phasePattern = /A/i;

      if (titleCheckResult === null) { // bad title
        validator.warn(
          issue,
          formatCheckLabel,
          'format-check-request.mst',
          { username: studentGithubId },
          `${account}/${repository}/PR #${issue.number}: Bad title`
        );

        return;
      } else if (repo.repo === 'addressbook-level3'
        && Validator.testTitle(titleCheckResult[1], week6TitlePattern)
        && Validator.testTitle(titleCheckResult[3], phasePattern)) {
        // this is to catch students using phase A team for some W6 LOs in level 3
        validator.warn(
          issue,
          formatCheckLabel,
          'wrong-phase-LO.mst',
          {},
          `${account}/${repository}/PR #${issue.number}: Bad LO-team mapping`
        );
        return;
      }

      if (Validator.hasLabel(issue, formatCheckLabel)) {
        validator.removeLabel(issue, formatCheckLabel);
      }

      const phase = titleCheckResult[3];
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
      const supervisor = student.supervisor;
      const teamLabels = student.labels;

      validator.assign(issue, reviewer);
      validator.assign(issue, supervisor);
      teamLabels.forEach(label => validator.addUniqueLabel(issue, label));
    };

    validator.filterBlock = filterBlock;
    validator.doBlock = doBlock;
  }
}

module.exports = Whitelist;
