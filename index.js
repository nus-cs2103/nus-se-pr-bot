// Load dotenv first
require('dotenv').config({silent: true});

var Accuser = require('accuser');

var accuser = new Accuser();

var githubAuthToken = {
  "type": "oauth",
  "token": process.env.GITHUB_TOKEN
};

accuser.authenticate(githubAuthToken);

var initializeSemesterRepositories = require('./src/semester');
initializeSemesterRepositories(accuser, 'addressbook-level1');
initializeSemesterRepositories(accuser, 'addressbook-level2');
initializeSemesterRepositories(accuser, 'addressbook-level3');
initializeSemesterRepositories(accuser, 'addressbook-level4');

var intializeSeEduRepositories = require('./src/seedu');
intializeSeEduRepositories(accuser, 'addressbook-level1');
intializeSeEduRepositories(accuser, 'addressbook-level2');
intializeSeEduRepositories(accuser, 'addressbook-level3');
intializeSeEduRepositories(accuser, 'addressbook-level4');

var intializeSeEduRcsRepository = require('./src/seedu-rcs');
intializeSeEduRcsRepository(accuser, 'rcs');

console.log ("Server has started");

accuser
  .run({assignee: "none"});
