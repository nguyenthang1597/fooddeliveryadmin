const { query } = require("./db");
const bcrypt = require("bcrypt-nodejs");

module.exports = {
  createAccount: (username, password, role, info) => {
    let _role = role || 1;
    let _password = bcrypt.hashSync(password, bcrypt.genSaltSync());
    return query(
      `INSERT INTO "Accounts"("Username", "Password", "Role", "Info") values ('${username}','${_password}',${_role}, ${info})`
    );
  },
  getAccounts: () => {
    return query('Select * from "Accounts"');
  },
  getByUsername: username => {
    return query(`select * from "Accounts" where "Username" = '${username}'`);
  },
  getById: id => {
    return query(`select * from "Accounts" where "Id" = ${id}`);
  },
  getInfoById: id => {
    return query(
      `SELECT "Info"."FullName", "Info"."Address", "Info"."Phone" FROM "Accounts", "Info" WHERE "Accounts"."Info" = "Info"."Id" and "Accounts"."Id" = ${id}`
    );
  },
  updateInfoById: (id, fullname, address, phone) => {
    let hasFN = fullname ? true : false;
    let hasAd = address ? true : false;
    let hasP = phone ? true : false;
    return query(
      `UPDATE public."Info" Set ${hasFN ? `"FullName" = '${fullname}'` : ""}
      ${hasAd || hasP ? ", " : ""}
      ${hasAd ? `"Address" = '${address}'` : ""} 
      ${hasP ? ", " : ""}
      ${hasP ? `"Phone" = '${phone}'` : ""} 
      FROM public."Accounts" WHERE "Accounts"."Info" = "Info"."Id" AND "Accounts"."Id" = ${id};`
    );
  }
};
