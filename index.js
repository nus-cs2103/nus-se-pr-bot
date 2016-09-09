// Load dotenv first
require('dotenv').config();

var Accuser = require('accuser');

var accuser = new Accuser();

var githubAuthToken = {
  "auth": {
    "type": "oauth",
    "token": process.env.GITHUB_TOKEN
  }
};

accuser.authenticate(githubAuthToken);

var initializeSemesterRepositories = require('./src/semester');
initializeSemesterRepositories(accuser, 'addressbook-level1');
initializeSemesterRepositories(accuser, 'addressbook-level2');

var intializeSeEduRepositories = require('./src/seedu');
intializeSeEduRepositories(accuser, 'addressbook-level1');
intializeSeEduRepositories(accuser, 'addressbook-level2');

console.log ("Server has started");

accuser
  .run({assignee: "none"});
