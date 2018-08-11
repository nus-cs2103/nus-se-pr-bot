// This class loads the root config file as well as each module-specific config
// & tutor-student mapping
// Basically a very thin wrapper around the config files

const { readdirSync } = require('fs');
const { join } = require('path');
const rootConfig = require(join(__dirname, '../config.json'));

class Config {
  constructor() {
    this.originAccount = rootConfig.originAccount;
    const semesterConfigDir = join(__dirname, '../', rootConfig.semesterConfigDir);
    this.modules = {};
    readdirSync(semesterConfigDir).forEach(name => {
      this.modules[name] = Config.retrieveConfigForModule(semesterConfigDir, name);
    });
  }

  static retrieveConfigForModule(semesterConfigDir, module) {
    const moduleConfigDir = join(semesterConfigDir, module);
    // eslint-disable-next-line global-require
    const moduleConfig = require(join(moduleConfigDir, 'config.json'));
    const studentMappingPath = join(moduleConfigDir, './data.csv');
    return { moduleConfig, studentMappingPath };
  }
}

module.exports = Config;
