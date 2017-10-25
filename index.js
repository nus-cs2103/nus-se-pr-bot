// Load dotenv first
require('dotenv').config({ silent: true });
const SubmissionRepos = require('./src/Whitelist');
const Blacklisted = require('./src/Blacklist');
const Greylisted = require('./src/Greylist');
const Accuser = require('accuser');
const currentLevel = require('./config').currentLevel;
const semesterAccount = require('./config').semesterAccount;
const originAccount = require('./config').originAccount;
const maxLevel = 4;

const accuser = new Accuser({ interval: 600000 });

const githubAuthToken = {
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
};

accuser.authenticate(githubAuthToken);

// Greylisted
for (let level = 1; level <= maxLevel; level += 1) {
  Greylisted(accuser, originAccount, `addressbook-level${level}`);
}

// Whitelisted
for (let level = 1; level <= currentLevel; level += 1) {
  SubmissionRepos(accuser, semesterAccount, `addressbook-level${level}`);
}

// Blacklisted
const blackListedSeEduRepos = [
  'samplerepo-pr-practice',
  'samplerepo-workflow-practice',
  'samplerepo-things'
];

const blackListedSemesterRepos = [
  'samplerepo-pr-practice',
  'samplerepo-things'
];

blackListedSeEduRepos.forEach(repo => {
  Blacklisted(accuser, originAccount, repo, 'practice-fork.mst');
});

blackListedSemesterRepos.forEach(repo => {
  Blacklisted(accuser, semesterAccount, repo, 'practice-fork.mst');
});

console.log('Bot Service has started');

// start the bot
accuser.run({ assignee: 'none' });
