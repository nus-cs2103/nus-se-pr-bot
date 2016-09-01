var Accuser = require('accuser');
var config = require("config");

var accuser = new Accuser();

accuser.authenticate(config.get('github.auth'));

var initializer = require('./src/initializer');
initializer(accuser, 'addressbook-level1');
initializer(accuser, 'addressbook-level2');

var seedu = require('./src/seedu');
seedu(accuser, 'addressbook-level1');
seedu(accuser, 'addressbook-level2');

console.log ("Server has started");

accuser
  .run({assignee: "none"});
