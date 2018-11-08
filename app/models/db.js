const client = require("../config/pg");

module.exports = {
    query: async (query)  => {
        console.log(query)
        return client.query(query)
    }
}