// Load dotenv first
require('dotenv').config({ silent: true });
const SubmissionRepos = require('./src/Whitelist');
const BlackListed = require('./src/Blacklist');
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
  BlackListed(accuser, 'se-edu', repo, 'practice-fork.mst');
});

blackListedSemesterRepos.forEach(repo => {
  BlackListed(accuser, semesterAccount, repo, 'practice-fork.mst');
});

BlackListed(accuser, 'se-edu', 'rcs', 'practice-fork.mst');

console.log('Bot Service has started');

// start the bot
accuser.run({ assignee: 'none' });
