var pg = require('pg');
var strings = require('./config/vars.json');

//DB connection
var client = new pg.Client(strings.db.connString);