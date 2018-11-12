const auth = require('./auth');
const restaurant = require('./restaurant')
const address = require('./address');
module.exports = (app) => {
    app.use('/auth', auth)
    app.use('/restaurant', restaurant)
    app.use('/address', address);
}