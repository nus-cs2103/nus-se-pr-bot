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

const github = new GitHubApi({
  auth: process.env.GITHUB_TOKEN
});

Object.values(modules).forEach(module => {
  const { moduleConfig, studentMappingPath } = module;
  const { repositories, semesterAccount } = moduleConfig;
  const phaseMapping = new StudentMapping(studentMappingPath);

  let uniqueLabels = {};
  Object.keys(warningLabels).forEach(label => {
    uniqueLabels[label] = warningLabels[label];
  });

  // eslint-disable-next-line
  [].concat.apply([], Object.values(phaseMapping.data).map(value => value.labels)).forEach(label => {
    uniqueLabels[label] = 'ededed';
  });

  repositories.forEach(repo => {
    let repoPromises = [];
    Object.keys(uniqueLabels).forEach(name => {
      const color = uniqueLabels[name];
      repoPromises.push(new Promise((resolve, reject) => {
        github.issues.createLabel({
          owner: semesterAccount,
          repo: repo,
          name: name,
          color: color
        }).then(() => {
          resolve();
        }, err => {
          if (!err) {
            resolve();
            return;
          }

          // Checks whether the error is because the label already exists.
          const errObj = JSON.parse(err.message);
          if (errObj.errors && errObj.errors[0] && errObj.errors[0].code === 'already_exists') {
            resolve();
            return;
          }
          reject(err);
        });
      }));
    });

    Promise.all(repoPromises)
      .then(() => `Added ${Object.keys(uniqueLabels).length} labels to ${semesterAccount}/${repo}`)
      .catch(err => console.log(err));
  });
});
