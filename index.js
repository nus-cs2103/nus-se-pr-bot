// Load dotenv first
require('dotenv').config({ silent: true });
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


// interval in milliseconds
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

// Greylisted (global-level)
for (let level = 1; level <= maxLevel; level += 1) {
  const repoName = `addressbook-level${level}`;
  const validator = new Validator(accuser, originAccount, repoName);
  const repo = new Greylisted(accuser, originAccount, repoName, validator);
  repoPromises.push(repo[runMethod]());
}

// Blacklisted (global-level)
const blackListedOriginRepos = [
  'samplerepo-pr-practice',
  'samplerepo-workflow-practice',
  'samplerepo-things'
];

blackListedOriginRepos.forEach(repoName => {
  const validator = new Validator(accuser, originAccount, repoName);
  const repo = new Blacklisted(accuser, originAccount, repoName, validator);
  repoPromises.push(repo[runMethod]());
});

const blackListedSemesterRepos = [];

Object.entries(modules).forEach(module => {
  const moduleName = module[0];
  const { moduleConfig, studentMappingPath } = module[1];
  const { repositories, semesterAccount } = moduleConfig;
  const phaseMapping = new StudentMapping(studentMappingPath);

  // Blacklisted (semester-level)
  blackListedSemesterRepos.forEach(repoName => {
    const validator = new Validator(accuser, semesterAccount, repoName);
    const repo = new Blacklisted(accuser, semesterAccount, repoName, validator);
    repoPromises.push(repo[runMethod]());
  });

  // Whitelisted (semester-level)
  repositories.forEach(repoName => {
    const validator = new Validator(accuser, semesterAccount, repoName);
    const repo = new SubmissionRepos(accuser, semesterAccount, repoName, validator,
      phaseMapping, moduleName, moduleConfig);
    repoPromises.push(repo[runMethod]());
  });
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
