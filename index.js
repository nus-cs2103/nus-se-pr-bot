var Accuser = require('accuser');
var config = require("config");

var accuser = new Accuser();

accuser.authenticate(config.get('github.auth'));

var initializer = require('./repos/process-pull-requests');
initializer(accuser, 'addressbook-level1');

console.log ("Server has started");

accuser
  .run({assignee: "none"});
