var config = require("config");
var utility = require('../utility');
var classMapping = config.get('classes');

module.exports = function(accuser) {
  var addressBookLevel1 = accuser.addRepository('nus-cs2103-AY1617S1', 'addressbook-level1');

  addressBookLevel1.newWorker()
    .filter(function(repository, issue){
      // ensure that we only work with PRs that do not have an assignee
      return issue.assignee === null;
    })
    .do(function(repository, issue) {
      var result = utility._titleRegex.exec(issue.title);

      if (result === null) {
        // we ignore the PR if we cannot parse the title into our issuee-defined regex
        return;
      }

      var activityId = result[1];
      var classId = result[2];
      var teamId = result[4];

      if (!classMapping[classId]) {
        // the class ID fetched is invalid.
        return;
      }

      var tutor = classMapping[classId][teamId];
      if (tutor) {
        accuser.accuse(repository, issue, tutor);
      }
    });
};
