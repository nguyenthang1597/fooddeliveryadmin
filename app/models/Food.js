const { query }  = require('./db');

module.exports = {
  createFood: (name, photoUrl, price) => {
    return query(`insert into "Food" ("Name", "PhotoUrl", "Price") values ('${name}', '${photoUrl}', ${price}) returning "Id"`)
  },
  count: () => query(`SELECT count("Id") as "Count" from "Food"`),
  updateFood: (id, photoUrl, price, name) => {
    return query(`update "Food" set "PhotoUrl" = '${photoUrl}', "Name" = '${name}', "Price" = '${price}' where "Id" = ${id}`)
  },
  delete: (id) => query(`update "Food" set "Delete" = 1 where "Id" = ${id}`)
}
