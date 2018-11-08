const { query } = require("./db");

module.exports = {
    getAll: () => {
      return query(
        `SELECT "Restaurant"."Id", "Restaurant"."Name", "Restaurant"."OpenTime", "Restaurant"."CloseTime", "Restaurant"."Like", "Restaurant"."Rating", "Restaurant"."PhotoUrl","Address"."Province", "Address"."Province", "Address"."District","Address"."Ward", "Address"."Street", "Address"."Number" FROM "Restaurant", "Address" WHERE "Restaurant"."Address" = "Address"."Id"`
      );
    },
    getById: (id) => {
      return query(
        `SELECT "Restaurant"."Id", "Restaurant"."Address", "Restaurant"."Name", "Restaurant"."OpenTime", "Restaurant"."CloseTime", "Restaurant"."Like", "Restaurant"."Rating", "Restaurant"."PhotoUrl","Address"."Province", "Address"."Province", "Address"."District","Address"."Ward", "Address"."Street", "Address"."Number" FROM "Restaurant", "Address" WHERE "Restaurant"."Address" = "Address"."Id" and "Restaurant"."Id" = ${id}`
      );
    },
    createRes: (name, opentime, closetime, photourl, addressId) => {
      return query(`INSERT INTO "Restaurant"("Name","OpenTime","CloseTime","PhotoUrl","Address") values ('${name}','${opentime ? opentime : '7:00'}','${closetime ? closetime: '23:00'}','${photourl ? photourl : null}', ${addressId})`)
    },
    updateResById: (id, name, openTime, closeTime) => {
      let hasName = name ? true : false;
      let hasOpenTime = openTime ? true : false
      let hasCloseTime = closeTime ? true : false
      if(!(hasName && hasCloseTime && hasOpenTime))
        return;
      return query(`
        Update "Restaurant" set 
        ${hasName ? `"Name" = '${name}'` : ""}
        ${hasOpenTime || hasCloseTime ? ", " : ""}
        ${hasOpenTime ? `"OpenTime" = '${openTime}'` : ""}
        ${hasCloseTime ? ", " : ""}
        ${hasCloseTime ? `"CloseTime" = '${closeTime}'` : ""}
        Where "Id" = ${id}
      `)
    }
};
