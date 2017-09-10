const utility = require('./utility');
const path = require('path');
let dataMapping = require('./DataParser').parse(path.join(__dirname, '../data.csv'));
let semesterAccount = require('../config').semesterAccount;
const mu = require('mu2');
mu.root = path.join(__dirname, 'templates');

let FormatCheckLabel = 'FormatCheckRequested';
const UserNameCheckLabel = 'GithubUsernameRequested';

module.exports = (accuser, repoName) => {
  // Checks if the issue has a label. method checks insensitively.
  const hasLabel = (issue, labelName) => {
    var result = false;
    issue.labels.forEach(label => {
      // find a case insensitive match for the label
      if (label.name.toLowerCase() === labelName.toLowerCase()) {
        result = true;
      }
    });
    return result;
  };

  const warnAbout = (repository, issue, label, warning, logText) => {
    if (hasLabel(issue, label)) {
      return;
    }

    console.log(`${logText} ${issue.number}`);
    accuser.addLabels(repository, issue, [label]);
    let student = {
      username: issue.user.login
    };
    let commentStream = mu.compileAndRender(warning, student);
    utility.castStreamToString(commentStream)
      .then(comment => accuser.comment(repository, issue, comment));
  };

  let assignReviewer = (repository, issue, reviewer) => {
    if (!reviewer) {
      console.log('no reviewer found for PR #' + issue.number);
      return;
    }

    console.log('Assigning reviewer to PR #' + issue.number);
    accuser.accuse(repository, issue, reviewer);
  };

  let repo = accuser.addRepository(semesterAccount, repoName);

  repo.newWorker()
    .filter((repository, issue) => {
      // ensure that we only work with PRs that do not have an assignee
      return issue.pull_request;
    })
    .do((repository, issue) => {
      console.log('Looking at PR #' + issue.number);

      let result = utility._titleRegex.exec(issue.title);

      if (result === null) {
        console.log('Cannot parse title of PR #' + issue.number);
        // we ignore the PR if we cannot parse the title into our issuee-defined regex
        warnAbout(repository,
          issue,
          FormatCheckLabel,
          'format-check-request.mst',
          'Adding warning for format fail to PR #');
        return;
      }

      if (hasLabel(issue, FormatCheckLabel)) {
        // now that the issue has a valid title, but the 'Format Check Requested'
        // label is still on it, let's remove the label.
        console.log('Removing format check request label from PR #' + issue.number);
        accuser.removeLabel(repository, issue, FormatCheckLabel);
      }

      let studentGithubId = issue.user.login;

      if (!dataMapping[studentGithubId]) {
        // not a student of this course
        console.log('student ' + studentGithubId + ' is not in this course');
        warnAbout(repository,
          issue,
          UserNameCheckLabel,
          'username-check-request.mst',
          'Adding warning for unknown user to PR #');
        return;
      }

      if (hasLabel(issue, UserNameCheckLabel)) {
        console.log('Removing username check request label from PR #' + issue.number);
        accuser.removeLabel(repository, issue, UserNameCheckLabel);
      }

      const reviewer = dataMapping[studentGithubId].reviewer;
      assignReviewer(repository, issue, reviewer);

      const labels = dataMapping[studentGithubId].labels;
      accuser.addLabels(repository, issue, labels);
    });
};
