const CustomAPIError = require('./custom-error')
const { StatusCodes } = require('http-status-codes')

class UnAuthorizedError extends CustomAPIError{
    constructor(msg,status){
        super(msg)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnAuthorizedError