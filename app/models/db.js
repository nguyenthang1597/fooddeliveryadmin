const pool = require("../config/pg");

module.exports = {
    query: (query) => {
        return pool.query(query);
    }
}