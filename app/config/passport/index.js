const LoginStrategy = require('./LoginStrategy');
const RegisterStrategy = require('./RegisterStrategy');

module.exports = (passport) => {
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.use('login', LoginStrategy);
    passport.use('register', RegisterStrategy);
}