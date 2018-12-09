const { query } = require("./db");

module.exports = {
  getAll: () => query('SELECT * FROM "Category"'),
  countByCategory: () => query(`SELECT "Food"."Category" as "Id", "Category"."Name", Count("Food"."Id") as "Total" From "Category", "Food" Where "Category"."Id" = "Food"."Category" Group by "Food"."Category", "Category"."Name"`)
}
