const utility = require('./utility');
const mu = require('mu2');
const path = require('path');
mu.root = path.join(__dirname, 'templates');

module.exports = (accuser, account, repoName) => {
  mu.compile('practice-fork.mst', () => {});
  let repo = accuser.addRepository(account, repoName);

  repo.newWorker()
    .do((repository, issue) => {
      console.log('Looking at ' + account + '/' + repoName + ' PR #' + issue.number);
      let commentStream = mu.render('practice-fork.mst');
      utility.castStreamToString(commentStream)
        .then(comment => {
          accuser.comment(repository, issue, comment);
          accuser.close(repository, issue);
        });
    });
};
