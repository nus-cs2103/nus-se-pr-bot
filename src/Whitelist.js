const Validator = require('./Validator');
const util = require('./utility');
const Repository = require('./Repository');

// Any repo that needs to be reviewed by a human should use this class
// i.e. this is a whitelist repo
class Whitelist extends Repository {
  constructor(accuser, account, repository, validator, phaseMapping, moduleName, moduleConfig) {
    super(accuser, account, repository, validator);
    this.moduleName = moduleName;
    this.moduleConfig = moduleConfig;
    this.phaseMapping = phaseMapping;
  }

  getTemplatePath(templateFileName) {
    return `${this.moduleName}/${templateFileName}`;
  }

  run() {
    const { account, moduleConfig, phaseMapping, repository, validator } = this;

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
          this.getTemplatePath('format-check-request.mst'),
          { username: studentGithubId },
          `${account}/${repository}/PR #${issue.number}: Bad title`
        );

        return;
      }

      if (Validator.hasLabel(issue, formatCheckLabel)) {
        validator.removeLabel(issue, formatCheckLabel);
      }

      const student = phaseMapping.getInfoForStudent(studentGithubId);
      const issueLink = moduleConfig.githubUsernameIssueLink;
      if (!student) {
        validator.warn(
          issue,
          usernameCheckLabel,
          'username-check-request.mst',
          { username: studentGithubId, githubUsernameIssueLink: issueLink },
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

      validator.requestReview(issue, reviewer);
      validator.assign(issue, supervisor);
      teamLabels.forEach(label => validator.addUniqueLabel(issue, label));
    };

    validator.filterBlock = filterBlock;
    validator.doBlock = doBlock;
  }
}

module.exports = Whitelist;
