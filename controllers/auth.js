const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { BadRequestError, UnAuthorizedError } = require('../errors')

const register = async (req,res)=> {

    const user = await User.create({...req.body})
    // const salt = await bcrypt.genSalt(10)
    // const hashedPass = await bcrypt.hash(req.body.password, salt)
    // const token = jwt.sign({usedId:user._id, name:user.name},'JwtSecret',{expiresIn:'30d'})
    const token = user.createJWT()
    console.log(token)
    res.status(StatusCodes.CREATED).json({ user:{name:user.name}, token})
}

const login = async (req,res)=> {
    const { email, password } = req.body

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})
    
    if(!user){
        throw new UnAuthorizedError('Invalid Credentials')
    }
    //compare password
    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched){
        throw new UnAuthorizedError('Invalid credentials')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({name:user.name, token})
}

module.exports = {
    register,
    login
}