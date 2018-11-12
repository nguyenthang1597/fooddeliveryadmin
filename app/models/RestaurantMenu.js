const {query} = require('./db');

module.exports = {
  createMenu: (ResId) => {
    return query(`insert into "RestaurantMenu" ("RestaurantId") values (${ResId})`);
  },
  getMenuIdOfRes: (resID) => {
    return query(`select "Menu" from "RestaurantMenu" where "RestaurantId" = ${resID}`)
  }
}