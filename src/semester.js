const utility = require('./utility');
const path = require('path');
const classMapping = require('./data').classes;
let semesterAccount = require('./data').semesterAccount;
const mu = require('mu2');
mu.root = path.join(__dirname, '/templates');

const FormatCheckLabel = 'FormatCheckRequested';

module.exports = (accuser, repoName) => {
  mu.compile('format-check-request.mst', () => {});

  // Checks if the issue has a label that matches with the FormatCheckLabel
  // method checks insensitively.
  const hasFormatCheckRequestedLabel = (issue) => {
    var result = false;
    issue.labels.forEach(label => {
      // find a case insensitive match for the label
      if (label.name.toLowerCase() === FormatCheckLabel.toLowerCase()) {
        result = true;
      }
    });
    return result;
  };

  const warnInvalidTitle = (repository, issue) => {
    if (hasFormatCheckRequestedLabel(issue)) {
      return;
    }

    console.log('Adding warning for format fail to PR #' + issue.number);
    accuser.addLabels(repository, issue, [FormatCheckLabel]);
    let student = {
      username: issue.user.login
    };
    let commentStream = mu.render('format-check-request.mst', student);
    utility.castStreamToString(commentStream)
      .then(comment => accuser.comment(repository, issue, comment));
  };

  const assignTutor = (repository, issue, tutor) => {
    if (!tutor) {
      console.log('no tutor found for PR #' + issue.number);
      return;
    }

    console.log('Assigning tutors to PR #' + issue.number);
    accuser.accuse(repository, issue, tutor);
  };

  let repo = accuser.addRepository(semesterAccount, repoName);

  repo.newWorker()
    .filter((repository, issue) => {
      // ensure that we only work with PRs that do not have an assignee
      return issue.pull_request;
    })
    .do((repository, issue) => {
      console.log('Looking at PR #' + issue.number);
      const result = utility._titleRegex.exec(issue.title);

      if (result === null) {
        console.log('Cannot parse title of PR #' + issue.number);
        // we ignore the PR if we cannot parse the title into our issuee-defined regex
        warnInvalidTitle(repository, issue);
        return;
      }

      // Activity ID can be retrieved using:
      // var activityId = result[1];
      const classId = result[1];
      const teamId = result[2];

      if (!classMapping[classId] || !teamId) {
        // the class ID fetched is invalid.
        console.log('wrong class or team ID for PR #' + issue.number);
        warnInvalidTitle(repository, issue);
        return;
      }

      const tutor = classMapping[classId][teamId];
      assignTutor(repository, issue, tutor);

      if (hasFormatCheckRequestedLabel(issue)) {
        // now that the issue has a valid title, but the 'Format Check Requested'
        // label is still on it, let's remove the label.
        console.log('Removing format check request label from PR #' + issue.number);
        accuser.removeLabel(repository, issue, FormatCheckLabel);
      }
    });
};
