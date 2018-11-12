const {query} = require('./db')

module.exports = {
  addFoodToMenu: (menuId, foodId) => {
    return query(`insert into "MenuDetail" ("MenuId","FoodId") values (${menuId}, ${foodId})`);
  }
}