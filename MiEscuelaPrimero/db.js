//documento para inicializar knex
const knex = require('knex');
const config = require('./knexfile.js');
module.exports = knex(config.development);