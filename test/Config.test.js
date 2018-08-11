const Config = require('../src/Config');

describe('Config should', () => {
  let config;

  beforeEach(() => {
    config = new Config();
  });

  it('have all values set', () => {
    Object.values(config).forEach(value => expect(value).toBeDefined());
  });

  it('have modules set with module configs set', () => {
    Object.values(config.modules)
      .forEach(module => {
        expect(module.studentMappingPath).toBeDefined();
        expect(module.moduleConfig.currentLevel).toBeDefined();
        expect(module.moduleConfig.semesterAccount).toBeDefined();
        expect(module.moduleConfig.githubUsernameIssueLink).toBeDefined();
      });
  });
});
