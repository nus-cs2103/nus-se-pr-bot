// Load dotenv first
require('dotenv').config({ silent: true });

const utility = require('./src/utility');
const Accuser = require('accuser');

let currentLevel = require('./config')['currentLevel'];
let semesterAccount = require('./config').semesterAccount;

const accuser = new Accuser({ interval: 600000 });

const githubAuthToken = {
  "type": "oauth",
  "token": process.env.GITHUB_TOKEN
};

accuser.authenticate(githubAuthToken);

// Whitelisted
const SubmissionRepos = require('./src/whitelist');
for (var level = 1; level <= currentLevel; ++level) {
  SubmissionRepos(accuser, `addressbook-level${level}`);
}

// Blacklisted
const BlackListed = require('./src/blacklist');
const blackListedRepos = [
  'sameplrepo-pr-practice',
  'samplerepo-workflow-practice',
  'samplerepo-things'
];

const blackListedAccounts = [
  'se-edu',
  semesterAccount
];

blackListedAccounts.forEach(account => {
  blackListedRepos.forEach(repo => {
    BlackListed(accuser, account, repo, 'practice-fork.mst');
  })
});


// this section of code ensures that student do not send pull requests to the
// se-edu repositories.
let intializeSeEduRepositories = require('./src/seedu');
intializeSeEduRepositories(accuser, 'addressbook-level1', utility._titleRegex);
intializeSeEduRepositories(accuser, 'addressbook-level2', utility._titleRegex);
intializeSeEduRepositories(accuser, 'addressbook-level3', utility._titleRegex);
intializeSeEduRepositories(accuser, 'addressbook-level4', utility._titleRegex);

// note that rcs repository has a different title regex string
intializeSeEduRepositories(accuser, 'rcs', utility._rcsTitleRegex);

console.log("Bot Service has started");


// start the bot
accuser.run({ assignee: "none" });
