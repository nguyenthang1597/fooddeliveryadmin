const { query } = require("./db");

module.exports = {
    createInfo: () => {
        return query(`INSERT INTO "Info"("FullName", "Address", "Phone") VALUES (null,null,null) returning "Id"`);
    }
};
