const jsonWebToken = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            return res.status(401).json({message: `No Authorization`})
        }

        const decoded = jsonWebToken.verify(token, config.get('jsonWebTokenSecret'))
        req.user = decoded
        next()


    } catch (e) {
        return res.status(401).json({message: `No Authorization`})
    }
}