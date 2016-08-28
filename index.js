var Accuser = require('accuser');
var config = require("config");

var accuser = new Accuser();

accuser.authenticate(config.get('github.auth'));

require('./repos/addressbook-level1')(accuser);

console.log ("Server has started");

accuser
  .run({assignee: "none"});
