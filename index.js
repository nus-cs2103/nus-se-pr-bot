var Accuser = require('accuser');
var config = require("config");

var accuser = new Accuser();

accuser.authenticate(config.get('github.auth'));

var _titleRegex = /^\[(\w+)\]\[(\w+)(\-(\w+)){0,1}\]/;

var classMapping = config.get('classes');

var tagTutor = function(accuser, pr, tutor) {
  // the team ID exists
  console.log ("Bot has assigned @" + tutor + " to PR #" + pr.number);
  // accuser.comment(pr, "By the bot: @" + tutor + " has been assigned.");
  accuser.accuse(pr, tutor);
};

var addressBookLevel1 = accuser.addRepository('nus-cs2103-AY1617S1', 'addressbook-level1');

addressBookLevel1.newWorker()
  .filter(function(repository, pr){
    // ensure that we only work with PRs that do not have an assignee
    return pr.assignee === null;
  })
  .do(function(repository, pr) {
    var result = _titleRegex.exec(pr.title);

    if (result === null) {
      // we ignore the PR if we cannot parse the title into our pre-defined regex
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
      tagTutor(accuser, pr, tutor);
    }
  });

console.log ("Server has started");

accuser
  .run();
