// Load dotenv first
require('dotenv').config({ silent: true });

const utility = require('./src/utility');
const Accuser = require('accuser');

let currentLevel = require('./config').currentLevel;
let semesterAccount = require('./config').semesterAccount;

const accuser = new Accuser({ interval: 600000 });

const githubAuthToken = {
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
};

accuser.authenticate(githubAuthToken);

// Whitelisted
const SubmissionRepos = require('./src/whitelist');
for (var level = 1; level <= currentLevel; level++) {
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
  });
});
BlackListed(accuser, 'se-edu', 'rcs', 'practice-fork.mst');

console.log('Bot Service has started');

// start the bot
accuser.run({ assignee: 'none' });
