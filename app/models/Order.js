const {query} = require('./db');
module.exports = {
  getAll: (page, perpage) => query(`SELECT * FROM "Order" ORDER BY "BookAt" DESC LIMIT ${perpage} OFFSET ${(page-1)*perpage}`),
  getDetail: id => query(`SELECT "Food"."Name", "OrderDetail"."Quatity", "Food"."Price", "Food"."PhotoUrl", "OrderDetail"."Note", "OrderDetail"."Quatity" * "Food"."Price" as "Total" FROM "OrderDetail", "Food" WHERE "OrderDetail"."Id" = ${id} and "OrderDetail"."Food" = "Food"."Id"`),
  addNew: (Name, District, Ward, Street, Number) => query(`INSERT INTO "Order" ("Name","District", "Ward","Street", "Number") VALUES ('${Name}','${District}','${Ward}','${Street}','${Number}') Returning "Id"`),
  countOrder: () => query(`SELECT count("Id") as "Total" FROM "Order"`),
  countOrderByState: () => query(`Select "Order"."State", count("Order"."Id") as "Count" from "Order" group by "Order"."State"`),
  addOrderDetail: (id, idFood, quantity, note) => query(`insert into "OrderDetail" ("Id", "Food", "Quatity", "Note") values (${id}, ${idFood}, ${quantity}, '${note}')`),
  getWaitingOrder: () => query(`select "Order".* from "Order" where "State" = 0 Order by "BookAt" DESC`),
  accept: (id, idDeliver) => query(`update "Order" set "Deliver" = ${idDeliver}, "State" = 1 where "Id" = ${id}`),
  getDeliver: (id) => query(`select "Deliver" from "Order" where "Id" = ${id}`)
}
