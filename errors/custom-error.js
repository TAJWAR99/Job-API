class CustomAPIError extends Error{
    constructor(msg,status){
        super(msg)
    }
}

module.exports = CustomAPIError