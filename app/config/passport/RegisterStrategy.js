const {Strategy} = require("passport-local");
const { getByUsername, createAccount } = require("../../models/Account");
const {createInfo} = require('../../models/Info');

module.exports = new Strategy({
    usernameField: "Username",
    passwordField: "Password",
    passReqToCallback: true
}, async (req, username, password, done) => {
    let data = {
        Username: req.body.Username,
        Password: req.body.Password,
        Role: req.body.Role || 1
    }
    let res = null, account = null;

    res = await getByUsername(data.Username);
    account = res.rows[0];

    if(account){
        const error = new Error('Tài khoàn tôàn tại');
        error.name = 'ExistAccount';
        return done(error);
    }
    try {
        res = await createInfo();
        let idInfo = res.rows[0].Id;
        res = await createAccount(data.Username, data.Password, data.Role, idInfo);
        return done(null);
    } catch (err) {
        const error = new Error('Tạo tài khoản không thành công!');
        error.name = 'UnHandleError';
        return done(error);
    }
   
})