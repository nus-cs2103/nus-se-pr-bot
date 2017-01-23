var utility = require('../utility');
var classMapping = require('./mapping')['classes'];

let semesterAccount = 'nus-cs2103-AY1617S2';

let warnInvalidTitle = (repository, issue) => {
  if (hasFormatCheckRequestedLabel(issue)) {
    return;
  }

  console.log("Adding warning for format fail to PR #" + issue.number);
  accuser.addLabels(repo, issue, ["FormatCheckRequested"]);
  var comment = "Hi @" + issue.user.login + ", your pull request title is invalid."
    + " It should be in the format of `[Activity ID][Team ID] Your name`,"
    + " where `[Activity Id]` has no dashes or spaces (e.g. `[T2A3]` stands"
    + " for Tutorial 2 Activity 3) and `[Team ID]` has one dash only and no"
    + " spaces (e.g. `[W14-A2]` means Wednesday 2pm (14 hrs), Phase A, Team 2)."
    + " Please follow the instructions given strictly and edit your title for reprocessing."
    + "\n\nSubmit only one activity per pull request (unless otherwise stated in instructions) and"
    + " do remember to create your branches from the commit where the `master` branch is pointing at so that each "
    + " PR you submit only consist of commits meant for the activity."
    + "\n\nNote: this comment is posted by a bot. If you believe this is done in error, please"
    + " create an issue at [cs2103-pr-bot](https://github.com/mauris/cs2103-pr-bot/issues) and add a link to this PR."
  accuser.comment(repository, issue, comment);
};

var hasFormatCheckRequestedLabel = (issue) => {
  var result = false;
  issue.labels.forEach(function(label){
    if (label.name.toLowerCase() == FormatCheckLabel.toLowerCase()) {
      result = true;
    }
  });
  return result;
};

let assignTutor = (repository, issue, tutor) => {
  if (!tutor) {
    console.log('no tutor found for PR #' + issue.number);
    return;
  }

  console.log("Assigning tutors to PR #" + issue.number);
  accuser.accuse(repository, issue, tutor);
};

module.exports = (accuser, repoName) => {
  let repo = accuser.addRepository(semesterAccount, repoName);
  let FormatCheckLabel = "FormatCheckRequested";

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

      var activityId = result[1];
      var classId = result[2];
      var teamId = result[4];

      if (!classMapping[classId] || !teamId) {
        // the class ID fetched is invalid.
        console.log('wrong class or team ID for PR #' + issue.number);
        warnInvalidTitle(repository, issue);
        return;
      }

      //var tutor = classMapping[classId][teamId];
      //assignTutor(repository, issue, tutor);

      if (hasFormatCheckRequestedLabel(issue)) {
        console.log("Removing format check label from PR #" + issue.number);
        accuser.removeLabel(repository, issue, FormatCheckLabel);
      }
    });
};
