var utility = require('./utility');

module.exports = (accuser, repoName, titleRegex) => {
  var repo = accuser.addRepository('se-edu', repoName);

  repo.newWorker()
    .filter((repository, issue) => {
      // ensure that we only work with PRs that do not have an assignee
      return issue.pull_request;
    })
    .do((repository, issue) => {
      console.log("Looking at se-edu PR #" + issue.number);
      var result = utility._titleRegex.exec(issue.title);

      // The PR is probably a legtimate one.
      // so we shall terminate.
      if (result === null) {
        return;
      }

      console.log("Commenting and closing se-edu " + repoName + " PR #" + issue.number);
      accuser.comment(repository, issue, "This PR should be against a repo in the org [nus-cs2103-AY1617S2](https://github.com/nus-cs2103-AY1617S2), "
        + "not against the repo in se-edu org :-)\n\nClosing ..."
        + "\n\nNote: this comment is posted by a bot. If you believe this is done in error, please"
        + " create an issue at [cs2103-pr-bot](https://github.com/mauris/cs2103-pr-bot/issues) and add a link to this PR.");
      accuser.close(repository, issue);
    });
};
