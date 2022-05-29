require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnAuthorizedError } = require('../errors')

const auth = (req,res,next)=> {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnAuthorizedError('Authentication Error 1')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //console.log('Payload',payload)
        //attach the user with the job routes
        req.user = { userId: payload.userId, name: payload.name}
        next()
    } catch (error) {
        throw new UnAuthorizedError('Authentication Error 2')
    }

}

module.exports = auth