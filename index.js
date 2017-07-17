// Load dotenv first
require('dotenv').config({silent: true});

var utility = require('./src/utility');
var Accuser = require('accuser');
let currentLevel = require('./src/data')['currentLevel'];

var accuser = new Accuser();

var githubAuthToken = {
  "type": "oauth",
  "token": process.env.GITHUB_TOKEN
};

accuser.authenticate(githubAuthToken);

// this section of code initializes Accuser for the current semester's repository
// currentLevel in data.json determines which highest level repository is already
//    made available to the students.
// previous semesters are no longer handled by this bot.
var initializeSemesterRepositories = require('./src/semester');
for (var level = 1; level < currentLevel; ++level) {
  initializeSemesterRepositories(accuser, 'addressbook-level' + level);
}

// this section of code ensures that student do not send pull requests to the
// se-edu repositories.
var intializeSeEduRepositories = require('./src/seedu');
intializeSeEduRepositories(accuser, 'addressbook-level1', utility._titleRegex);
intializeSeEduRepositories(accuser, 'addressbook-level2', utility._titleRegex);
intializeSeEduRepositories(accuser, 'addressbook-level3', utility._titleRegex);
intializeSeEduRepositories(accuser, 'addressbook-level4', utility._titleRegex);

// note that rcs repository has a different title regex string
intializeSeEduRepositories(accuser, 'rcs', utility._rcsTitleRegex);

console.log ("Bot Service has started");


// start the bot
accuser
  .run({ assignee: "none" });
