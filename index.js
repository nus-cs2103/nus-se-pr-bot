// Load dotenv first
require('dotenv').config({ silent: true });
const path = require('path');
const Promise = require('bluebird');
const SubmissionRepos = require('./src/Whitelist');
const Blacklisted = require('./src/Blacklist');
const Greylisted = require('./src/Greylist');
const Accuser = require('accuser');
const Validator = require('./src/Validator');
const StudentMapping = require('./src/StudentMapping');
const A = new StudentMapping(path.join(__dirname, './data-A.csv'));
const B = new StudentMapping(path.join(__dirname, './data-B.csv'));
const phaseMappings = { A, B };
const currentLevel = require('./config').currentLevel;
const semesterAccount = require('./config').semesterAccount;
const originAccount = require('./config').originAccount;
const maxLevel = 4;

// interval in miliseconds
// 10 min interval
const accuser = new Accuser({ interval: 600000 });

// Can pass optional argument to do a dry run that checks for required permissions
const isDryRun = process.argv.length > 2 && process.argv[2] === 'dry';
const runMethod = isDryRun ? 'dryCheck' : 'checkAndRun';

const githubAuthToken = {
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
};

accuser.authenticate(githubAuthToken);

let repoPromises = [];

// Whitelisted
// for (let level = 1; level <= currentLevel; level += 1) {
  const repoName = `dummy_repo`;
  const validator = new Validator(accuser, semesterAccount, repoName);
  const repo = new SubmissionRepos(accuser, semesterAccount, repoName, validator, phaseMappings);
  repoPromises.push(repo[runMethod]());
// }

Promise.all(repoPromises).then(() => {
  if (!isDryRun) {
    // start the bot
    console.log('Bot Service has started');

    accuser.run({ assignee: 'none' });
  }
}, () => {
  console.log('Not all permissions are satisfied :-)');
});
