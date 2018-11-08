const client = require("../config/pg");

module.exports = {
    query: async (query)  => {
        return client.query(query)
    }
}