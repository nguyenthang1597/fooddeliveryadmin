const auth = require('./auth');
const restaurant = require('./restaurant')
module.exports = (app) => {
    app.use('/auth', auth)
    app.use('/restaurant', restaurant)
}