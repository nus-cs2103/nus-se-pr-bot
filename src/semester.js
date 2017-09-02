const utility = require('./utility');
const path = require('path');
let dataMapping = require('./DataParser').parse(path.join(process.env.PWD, 'data.csv'));
let semesterAccount = require('../config').semesterAccount;
const mu = require('mu2');
mu.root = __dirname + '/templates';

let FormatCheckLabel = "FormatCheckRequested";

module.exports = (accuser, repoName) => {
  mu.compile('format-check-request.mst', () => {});

  let warnInvalidTitle = (repository, issue) => {
    if (hasFormatCheckRequestedLabel(issue)) {
      return;
    }

    console.log("Adding warning for format fail to PR #" + issue.number);
    accuser.addLabels(repo, issue, [FormatCheckLabel]);
    let student = {
      username: issue.user.login
    };
    let commentStream = mu.render('format-check-request.mst', student);
    utility.castStreamToString(commentStream)
      .then(comment => accuser.comment(repository, issue, comment));
  };

  // Checks if the issue has a label that matches with the FormatCheckLabel
  // method checks insensitively.
  var hasFormatCheckRequestedLabel = (issue) => {
    var result = false;
    issue.labels.forEach(function(label){
      // find a case insensitive match for the label
      if (label.name.toLowerCase() == FormatCheckLabel.toLowerCase()) {
        result = true;
      }
    });
    return result;
  };

  let assignReviewer = (repository, issue, reviewer) => {
    if (!reviewer) {
      console.log('no reviewer found for PR #' + issue.number);
      return;
    }

    console.log("Assigning reviewer to PR #" + issue.number);
    accuser.accuse(repository, issue, reviewer);
  };

  let repo = accuser.addRepository(semesterAccount, repoName);

  repo.newWorker()
    .filter((repository, issue) => {
      // ensure that we only work with PRs that do not have an assignee
      return issue.pull_request;
    })
    .do((repository, issue) => {
      console.log("Looking at PR #" + issue.number);
      var result = utility._titleRegex.exec(issue.title);

      if (result === null) {
        console.log('Cannot parse title of PR #' + issue.number);
        // we ignore the PR if we cannot parse the title into our issuee-defined regex
        warnInvalidTitle(repository, issue);
        return;
      }

      let studentGithubId = issue.user.login;

      if (!dataMapping[studentGithubId]) {
        // not a student of this course
        console.log('student ' + studentGithubId + ' is not in this course');
        warnInvalidTitle(repository, issue);
        return;
      }

      let reviewer = dataMapping[studentGithubId].reviewer;
      assignReviewer(repository, issue, reviewer);

      let labels = dataMapping[studentGithubId].labels;
      accuser.addLabels(repository, issue, labels);

      if (hasFormatCheckRequestedLabel(issue)) {
        // now that the issue has a valid title, but the "Format Check Requested"
        // label is still on it, let's remove the label.
        console.log("Removing format check request label from PR #" + issue.number);
        accuser.removeLabel(repository, issue, FormatCheckLabel);
      }
    });
};
