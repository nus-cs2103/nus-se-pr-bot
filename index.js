// Load dotenv first
require('dotenv').config({ silent: true });
const Promise = require('bluebird');
const SubmissionRepos = require('./src/Whitelist');
const Config = require('./src/Config');
const Blacklisted = require('./src/Blacklist');
const Greylisted = require('./src/Greylist');
const Accuser = require('accuser');
const Validator = require('./src/Validator');
const StudentMapping = require('./src/StudentMapping');

const config = new Config();
const originAccount = config.originAccount;
const modules = config.modules;
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

// Greylisted
for (let level = 1; level <= maxLevel; level += 1) {
  const repoName = `addressbook-level${level}`;
  const validator = new Validator(accuser, originAccount, repoName);
  const repo = new Greylisted(accuser, originAccount, repoName, validator);
  repoPromises.push(repo[runMethod]());
}

// Blacklisted
const blackListedOriginRepos = [
  'samplerepo-pr-practice',
  'samplerepo-workflow-practice',
  'samplerepo-things'
];

const blackListedSemesterRepos = [
  'samplerepo-pr-practice',
  'samplerepo-things'
];

blackListedOriginRepos.forEach(repoName => {
  const validator = new Validator(accuser, originAccount, repoName);
  const repo = new Blacklisted(accuser, originAccount, repoName, validator);
  repoPromises.push(repo[runMethod]());
});

Object.values(modules).forEach(module => {
  const { moduleConfig, studentMappingPath } = module;
  const { currentLevel, semesterAccount } = moduleConfig;
  const phaseMapping = new StudentMapping(studentMappingPath);

  blackListedSemesterRepos.forEach(repoName => {
    const validator = new Validator(accuser, semesterAccount, repoName);
    const repo = new Blacklisted(accuser, semesterAccount, repoName, validator);
    repoPromises.push(repo[runMethod]());
  });


  // Whitelisted
  for (let level = 1; level <= currentLevel; level += 1) {
    const repoName = `addressbook-level${level}`;
    const validator = new Validator(accuser, semesterAccount, repoName);
    const repo = new SubmissionRepos(accuser, semesterAccount, repoName, validator,
      phaseMapping, moduleConfig);
    repoPromises.push(repo[runMethod]());
  }
});

Promise.all(repoPromises).then(() => {
  if (!isDryRun) {
    // start the bot
    console.log('Bot Service has started');

    accuser.run({ assignee: 'none' });
  }
}, () => {
  console.log('Not all permissions are satisfied :-)');
});
