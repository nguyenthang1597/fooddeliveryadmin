const { Pool } = require('pg');
const config = require('./config.json');

const pool = new Pool({
    host: config.PGHOST,
    user: config.PGUSER,
    database: config.PGDATABASE,
    password: config.PGPASSWORD,
    port: config.PGPORT,
    max: config.MAX,
    idleTimeoutMillis: 5000
})


module.exports = pool;