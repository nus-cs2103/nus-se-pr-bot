const Config = require('../src/Config');

describe('Config should', () => {
  let config;

  beforeEach(() => {
    config = new Config();
  });

  it('have all values set', () => {
    Object.values(config).forEach(value => expect(value).toBeTruthy());
  });

  it('have at least 1 module', () => {
    expect(Object.keys(config.modules).length > 1);
  });

  it('have modules set with module configs set', () => {
    Object.values(config.modules)
      .forEach(module => {
        expect(module.studentMappingPath).toBeTruthy();
        expect(module.moduleConfig.currentLevel).toBeDefined(); // since 0 is not truthy
        expect(module.moduleConfig.semesterAccount).toBeTruthy();
        expect(module.moduleConfig.githubUsernameIssueLink).toBeTruthy();
      });
  });
});
