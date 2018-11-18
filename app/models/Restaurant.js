const { query } = require("./db");

module.exports = {
    getAll: (page, perpage) => {
      return query(
        `SELECT "Restaurant"."Id", "Restaurant"."Name", "Restaurant"."OpenTime", "Restaurant"."CloseTime", "Restaurant"."Like", "Restaurant"."Rating", "Restaurant"."PhotoUrl","Address"."Province", "Address"."Province", "Address"."District","Address"."Ward", "Address"."Street", "Address"."Number" FROM "Restaurant", "Address" WHERE "Restaurant"."Address" = "Address"."Id" LIMIT ${perpage} OFFSET ${perpage * (page - 1)}`
      );
    },
    getById: (id) => {
      return query(
        `SELECT "Restaurant"."Id", "Restaurant"."Address", "Restaurant"."Name", "Restaurant"."OpenTime", "Restaurant"."CloseTime", "Restaurant"."Like", "Restaurant"."Rating", "Restaurant"."PhotoUrl","Address"."Province", "Address"."Province", "Address"."District","Address"."Ward", "Address"."Street", "Address"."Number" FROM "Restaurant", "Address" WHERE "Restaurant"."Address" = "Address"."Id" and "Restaurant"."Id" = ${id}`
      );
    },
    createRes: (name, opentime, closetime, photourl, addressId) => {
      return query(`INSERT INTO "Restaurant"("Name","OpenTime","CloseTime","PhotoUrl","Address") values ('${name}','${opentime ? opentime : '7:00'}','${closetime ? closetime: '23:00'}','${photourl ? photourl : null}', ${addressId}) Returning "Id"`)
    },
    updateResById: (id, name, openTime, closeTime, PhotoUrl) => {
      let hasName = name ? true : false;
      let hasOpenTime = openTime ? true : false
      let hasCloseTime = closeTime ? true : false
      let hasPhotoUrl = PhotoUrl ? true : false;
      let makeQuery = hasName || hasOpenTime || hasCloseTime || hasPhotoUrl;
      if(!makeQuery) return;
      return query(`
        Update "Restaurant" set 
        ${hasName ? `"Name" = '${name}'` : ""}
        ${hasName && (hasOpenTime || hasCloseTime) ? ", " : ""}
        ${hasOpenTime ? `"OpenTime" = '${openTime}'` : ""}
        ${hasOpenTime && (hasCloseTime || hasPhotoUrl) ? ", " : ""}
        ${hasCloseTime ? `"CloseTime" = '${closeTime}'` : ""}
        ${hasCloseTime && hasPhotoUrl ? "," : ''}
        ${hasPhotoUrl ? `"PhotoUrl" = '${PhotoUrl}'` : ''}
        Where "Id" = ${id}
      `)
    },
    getMenuById: (id) => {
      return query(`select "Food".* from "Food", "MenuDetail", "RestaurantMenu" where "RestaurantMenu"."Menu" = "MenuDetail"."MenuId" and "MenuDetail"."FoodId" = "Food"."Id" and "RestaurantMenu"."RestaurantId" = ${id}`)
    },
    countNumberRestaurant: () => {
      return query(`select count("Id") as Total from "Restaurant"`)
    },
};
