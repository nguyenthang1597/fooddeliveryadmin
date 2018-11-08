const jwt = require('jsonwebtoken');
const {getById} = require('../models/Account');
const config = require('../config/config.json');

module.exports = (req, res, next) => {
    const authorization = req.headers.authorization || req.body.authorization;
    if (!authorization)
        return res.status(401).end();
    const token = authorization.split(' ')[1];

    return jwt.verify(token, config.jwtSecret, async (err, decode) => {
        if (err) return res.status(401).end();
        const id = decode.Id;
        let result = await getById(id);
        if(!result.rows[0]){
            return res.status(401).end();
        }
        req.Id = id;
        return next();
    })
}