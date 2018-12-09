const { query }  = require('./db');

module.exports = {
  createFood: (name, photoUrl, price) => {
    return query(`insert into "Food" ("Name", "PhotoUrl", "Price") values ('${name}', '${photoUrl}', ${price}) returning "Id"`)
  },
  count: () => query(`SELECT count("Id") as "Count" from "Food"`)
}
