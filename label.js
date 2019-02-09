require('dotenv').config({ silent: true });
const GitHubApi = require('@octokit/rest');
const Config = require('./src/Config');
const StudentMapping = require('./src/StudentMapping');

const config = new Config();
const modules = config.modules;

// TODO: How to make it less manual?
const warningLabels = {
  FormatCheckRequested: 'ba3940',
  GithubUserNameRequested: 'd73a4a'
};

const github = new GitHubApi({});
const githubAuth = {
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
};

github.authenticate(githubAuth);

Object.values(modules).forEach(module => {
  const { moduleConfig, studentMappingPath } = module;
  const { currentLevel, semesterAccount } = moduleConfig;
  const phaseMapping = new StudentMapping(studentMappingPath);

  let uniqueLabels = {};
  Object.keys(warningLabels).forEach(label => {
    uniqueLabels[label] = warningLabels[label];
  });

  // eslint-disable-next-line
  [].concat.apply([], Object.values(phaseMapping.data).map(value => value.labels)).forEach(label => {
    uniqueLabels[label] = 'ededed';
  });

  for (let level = 1; level <= currentLevel; level += 1) {
    const repo = `addressbook-level${level}`;
    let repoPromises = [];
    Object.keys(uniqueLabels)
      .forEach(name => {
        const color = uniqueLabels[name];
        repoPromises.push(new Promise((resolve, reject) => {
          github.issues
            .createLabel({ name, color, repo, owner: semesterAccount }, userError => {
              if (!userError) {
                resolve();
                return;
              }

              const errorObj = JSON.parse(userError.message);
              if (!!errorObj.errors && !!errorObj.errors[0]
                && errorObj.errors[0].code === 'already_exists') {
                resolve(); // consider a success if label already exists
                return;
              }

              reject(userError);
            });
        }));
      });
    Promise.all(repoPromises)
      .then(() => `Added ${Object.keys(uniqueLabels).length} labels to ${semesterAccount}/${repo}`)
      .catch(err => console.log(err));
  }
});
