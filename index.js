var Accuser = require('accuser');
var config = require("config");

var accuser = new Accuser();

accuser.authenticate(config.get('github.auth'));

var _titleRegex = /^\[(\w+)\]\[(\w+)(\-(\w+)){0,1}\]/;

var classMapping = config.get('classes');

var tagTutor = function(accuser, pr, tutor) {
  // the team ID exists
  console.log ("Bot has assigned " + tutor + " to PR #" + pr.number);
  // accuser.comment(pr, "By the bot: @" + tutor + " has been assigned.");
  accuser.accuse(pr, tutor);
}

var tagTutorsIfNoTeamIdExists = function(accuser, pr, classTutors) {
  // unknown team ID, but at least there's class
  // so we assign all tutors in that class
  var comment = '';
  var tutors = {}

  for (var i in classTutors) {
    tutors[classTutors[i]] = true;
  }

  for (var tutor in tutors) {
    comment += "@" + tutor + " ";
  }
  comment += "- from PR bot, please review this.";
  console.log ("Bot has commented on PR #" + pr.number);
  accuser.comment(pr, comment);
};

accuser.addWorker()
  .filter(function(pr){
    return pr.assignee === null;
  })
  .do(function(pr) {
    var result = _titleRegex.exec(pr.title);
    if (result === null) {
      return;
    }
    var activityId = result[1];
    var classId = result[2];
    var teamId = result[4];

    if (!classMapping[classId]) {
      return;
    }

    var tutor = classMapping[classId][teamId];
    if (tutor) {
      tagTutor(accuser, pr, tutor);
    } else {
      tagTutorsIfNoTeamIdExists(accuser, pr, classMapping[classId]);
    }
  });

console.log ("Server has started");

accuser
  .watch('nus-cs2103-AY1617S1', 'addressbook-level1')
  .run();
