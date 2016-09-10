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

var intializeSeEduRepositories = require('./src/seedu');
intializeSeEduRepositories(accuser, 'addressbook-level1');
intializeSeEduRepositories(accuser, 'addressbook-level2');
intializeSeEduRepositories(accuser, 'addressbook-level3');

console.log ("Server has started");

accuser
  .run({assignee: "none"});
