const gulp = require('gulp');

/**
 * Main gulp script to perform requires and starting the build process
 * @exports null
 */

(() => {
  'use strict';

  // load all the scripts in the gulp folder
  // essentially declariing all the tasks available
  require('require-dir')('./gulp/');
})();
