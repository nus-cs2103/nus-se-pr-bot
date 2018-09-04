require('dotenv').config({ silent: true });
const fetch = require('node-fetch');
const Config = require('./src/Config');
const StudentMapping = require('./src/StudentMapping');

const config = new Config();
const modules = config.modules;
const token = process.env.GITHUB_TOKEN;

// TODO: How to make it less manual?
const warningLabels = {
  FormatCheckRequested: 'ba3940',
  GithubUserNameRequested: 'd73a4a'
};

Object.values(modules).forEach(module => {
  const { moduleConfig, studentMappingPath } = module;
  const { currentLevel, semesterAccount } = moduleConfig;
  const phaseMapping = new StudentMapping(studentMappingPath);

  let uniqueLabels = {};
  Object.keys(warningLabels).forEach(label => {
    uniqueLabels[label] = warningLabels[label];
  });

  [].concat.apply([], Object.values(phaseMapping.data).map(value => value.labels)).forEach(label => {
    uniqueLabels[label] = 'ededed';
  });

  for (let level = 1; level <= currentLevel; level += 1) {
    const repoName = `addressbook-level${level}`;

    // TODO: Use octokit once it supports creating label on repo
    console.log(`Adding ${Object.keys(uniqueLabels).length} labels to ${semesterAccount}/${repoName}`);
    Object.keys(uniqueLabels)
      .forEach(name => {
        const color = uniqueLabels[name];
        fetch(`https://api.github.com/repos/${semesterAccount}/${repoName}`
          + `/labels?access_token=${encodeURIComponent(token)}`, {
          method: 'post',
          body: JSON.stringify({ name, color })
        });
      });
  }
});
