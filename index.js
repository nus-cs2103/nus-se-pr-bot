// Load dotenv first
require('dotenv').config({ silent: true });
const SubmissionRepos = require('./src/Whitelist');
const BlackListed = require('./src/Blacklist');
const Accuser = require('accuser');
let currentLevel = require('./config').currentLevel;
let semesterAccount = require('./config').semesterAccount;

const accuser = new Accuser({ interval: 600000 });
const seEduAccount = 'se-edu';

// Can pass optional argument to do a dry run that checks for required permissions
const isDryRun = process.argv.length > 2 && process.argv[2] === 'dry';
const runMethod = isDryRun ? 'dryCheck' : 'checkAndRun';

const githubAuthToken = {
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
};

accuser.authenticate(githubAuthToken);


// Blacklisted
const blackListedSeEduRepos = [
  'samplerepo-pr-practice',
  'samplerepo-workflow-practice',
  'samplerepo-things',
  'rcs'
];

const blackListedSemesterRepos = [
  'samplerepo-pr-practice',
  'samplerepo-things'
];

blackListedSeEduRepos.forEach(repoName => {
  const repo = new BlackListed(accuser, seEduAccount, repoName);
  repo[runMethod]();
});

blackListedSemesterRepos.forEach(repoName => {
  const repo = new BlackListed(accuser, semesterAccount, repoName);
  repo[runMethod]();
});

// Whitelisted
for (let level = 1; level <= currentLevel; level += 1) {
  const repo = new SubmissionRepos(accuser, semesterAccount, `addressbook-level${level}`);
  repo[runMethod]();
}

if (!isDryRun) {
// start the bot
  console.log('Bot Service has started');

  accuser.run({assignee: 'none'});
}
