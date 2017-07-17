// Load dotenv first
require('dotenv').config({silent: true});

var utility = require('./utility');
var Accuser = require('accuser');

var accuser = new Accuser();

var githubAuthToken = {
  "type": "oauth",
  "token": process.env.GITHUB_TOKEN
};

accuser.authenticate(githubAuthToken);

var initializeSemesterRepositories = require('./src/semester');
//initializeSemesterRepositories(accuser, 'addressbook-level1');
//initializeSemesterRepositories(accuser, 'addressbook-level2');
//initializeSemesterRepositories(accuser, 'addressbook-level3');
//initializeSemesterRepositories(accuser, 'addressbook-level4');

var intializeSeEduRepositories = require('./src/seedu');
intializeSeEduRepositories(accuser, 'addressbook-level1', utility._titleRegex);
intializeSeEduRepositories(accuser, 'addressbook-level2', utility._titleRegex);
intializeSeEduRepositories(accuser, 'addressbook-level3', utility._titleRegex);
intializeSeEduRepositories(accuser, 'addressbook-level4', utility._titleRegex);

// note that rcs repository has a different title regex string
intializeSeEduRepositories(accuser, 'rcs', utility._rcsTitleRegex);

console.log ("Bot Service has started");

accuser
  .run({assignee: "none"});
