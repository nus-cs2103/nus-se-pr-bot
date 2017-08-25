const utility = require('./utility');
let semesterAccount = require('./data').semesterAccount;
const mu = require('mu2');
mu.root = __dirname + '/templates';

module.exports = (accuser, repoName, titleRegex) => {
  mu.compile('wrong-repository.mst', () => {});
  var repo = accuser.addRepository('se-edu', repoName);

  repo.newWorker()
    .filter((repository, issue) => {
      // ensure that we only work with PRs that do not have an assignee
      return issue.pull_request;
    })
    .do((repository, issue) => {
      console.log("Looking at se-edu/" + repoName + " PR #" + issue.number);
      var result = titleRegex.exec(issue.title);

      // The PR is probably a legtimate one based on title regex no match
      // so we shall skip this issue.
      if (result === null) {
        return;
      }

      console.log("Commenting & closing se-edu/" + repoName + " PR #" + issue.number);
      let view = {
        semesterAccount: semesterAccount
      };
      let commentStream = mu.render('wrong-repository.mst', view);
      utility.castStreamToString(commentStream)
        .then(comment => {
          accuser.comment(repository, issue, comment);
          accuser.close(repository, issue);
        });
    });
};
