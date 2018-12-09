const auth = require('./auth');
const restaurant = require('./restaurant')
const address = require('./address');
const order= require('./order')
const category = require('./category')
const food = require('./food')
module.exports = (app) => {
    app.use('/auth', auth)
    app.use('/restaurant', restaurant)
    app.use('/address', address);
    app.use('/order', order);
    app.use('/category', category)
    app.use('/food', food)
}
