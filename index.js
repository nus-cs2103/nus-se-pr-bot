// Load dotenv first
require('dotenv').config({ silent: true });
const SubmissionRepos = require('./src/whitelist');
const BlackListed = require('./src/blacklist');
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
for (let level = 1; level <= currentLevel; level += 1) {
  SubmissionRepos(accuser, `addressbook-level${level}`);
}

// Blacklisted
const blackListedRepos = [
  'samplerepo-pr-practice',
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
