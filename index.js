var Accuser = require('accuser');
var config = require("config");

var accuser = new Accuser();

accuser.authenticate(config.get('github.auth'));

var _titleRegex = /^\[(\w+)\]\[(\w+)(\-(\w+)){0,1}\]/;

var classMapping = config.get('classes');

accuser.addWorker()
  .filter(function(pr){
    return pr.assignee === null;
  })
  .do(function(pr) {
    var result = _titleRegex.exec(pr.title);
    if (result !== null) {
      var activityId = result[1];
      var classId = result[2];
      var teamId = result[4];

      if (classMapping[classId]) {
        if (classMapping[classId][teamId]) {
          console.log ("Bot has assigned " + classMapping[classId][teamId] + " to PR #" + pr.number);
          //accuser.comment(pr, "By the bot: @" + classMapping[classId][teamId] + " has been assigned.");
          accuser.accuse(pr, classMapping[classId][teamId]);
        } else {
          // unknown team ID, but at least there's class
          // so we assign all tutors in that class
          var tutors = {}
          for (var i in classMapping[classId]) {
            tutors[classMapping[classId][i]] = true;
          }
          var comment = '';
          for (var tutor in tutors) {
            comment += "@" + tutor + " ";
          }
          comment += "- from PR bot, please review this.";
          console.log ("Bot has commented on PR #" + pr.number);
          accuser.comment(pr, comment);
        }
      }
    }
  });

console.log ("Server has started");

accuser
  .watch('nus-cs2103-AY1617S1', 'addressbook-level1')
  .run();
