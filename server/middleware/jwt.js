const jwt = require('jsonwebtoken')
const User = require('../models/User')
const SECRET_AT = process.env.ACCESS_TOKEN_SECRET

const authProtect = async (req, res, next) => {
    if (
        req.headers.authorization ||
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            const token = req.headers.authorization.split(" ")[1]
            const { _id } = jwt.verify(token, SECRET_AT)
            req.user = await User.findById(_id).select("-password")
            next()
        }
        catch (error) {
            return res.status(401).json({message: "Token has failed, unauthorized"})
        }
    }
    else {
        res.status(401).json({message: "No token, Unauthorized"})
    }
}


module.exports = {authProtect}