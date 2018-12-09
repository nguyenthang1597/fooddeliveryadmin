const {query} = require('./db');
module.exports = {
  getAll: (page, perpage) => query(`SELECT * FROM "Order" ORDER BY "BookAt" DESC LIMIT ${perpage} OFFSET ${(page-1)*perpage}`),
  getDetail: id => query(`SELECT "Food"."Name", "OrderDetail"."Quatity", "Food"."Price", "Food"."PhotoUrl", "OrderDetail"."Note", "OrderDetail"."Quatity" * "Food"."Price" as "Total" FROM "OrderDetail", "Food" WHERE "OrderDetail"."Id" = ${id} and "OrderDetail"."Food" = "Food"."Id"`),
  addNew: (Name, District, Ward, Street, Number) => query(`INSERT INTO "Order" ("Name","District", "Ward","Street", "Number") VALUES ('${Name}','${District}','${Ward}','${Street}','${Number}')`),
  countOrder: () => query(`SELECT count("Id") as "Total" FROM "Order"`)
}
