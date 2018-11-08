const { Client } = require('pg');
const config = require('./config.json');


const client = new Client({
    connectionString: 'postgres://aslhmwkzhekdoc:73300aed7812ebff64b04db5ce83acd00cd9ed81239559063ec1fbedf9649175@ec2-107-21-93-132.compute-1.amazonaws.com:5432/dc1cd5phijh2s2?ssl=true'
})

module.exports = client;