// This class loads the root config file as well as each module-specific config
// & tutor-student mapping
// Basically a very thin wrapper around the config files

const path = require('path');
const rootConfig = require(path.join(__dirname, '../config.json'));

class Config {
  constructor() {
    this.originAccount = rootConfig.originAccount;
    const semesterConfigDir = rootConfig.semesterConfigDir;
    this.modules = {};
    rootConfig.modules.forEach(module => {
      this.modules[module] = Config.retrieveConfigForModule(semesterConfigDir, module);
    });
  }

  static retrieveConfigForModule(semesterConfigDir, module) {
    const moduleConfigDir = path.join(__dirname, '../', semesterConfigDir, module);
    // eslint-disable-next-line global-require
    const moduleConfig = require(path.join(moduleConfigDir, 'config.json'));
    const studentMappingPath = path.join(moduleConfigDir, './data.csv');
    return { moduleConfig, studentMappingPath };
  }
}

module.exports = Config;
