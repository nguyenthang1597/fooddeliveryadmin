const {Strategy} = require("passport-local");
const { getByUsername } = require("../../models/Account");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config.json");

module.exports = new Strategy(
  {
    usernameField: "Username",
    passwordField: "Password",
    session: false
  },
  async (username, password, done) => {
    let account = null;
    let res = await getByUsername(username);
    account = res.rows[0];
    console.log(account)
    if (!account) {
      const error = new Error("Tài khoản không tồn tại!");
      error.name = "NotExistAccount";
      return done(error);
    }
    if (!bcrypt.compareSync(password, account.Password)) {
      const error = new Error("Mật khẩu không đúng!");
      error.name = "WrongPassword";
      return done(error);
    }
    const payload = {
      Id: account.Id,
      Role: account.Role
    };
    const token = jwt.sign(payload, jwtSecret);
    return done(null, token);
  }
);
