const { query } = require("./db");

module.exports = {
  getAll: () => query('SELECT * FROM "Category"')
}
