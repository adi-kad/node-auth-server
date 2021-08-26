const jwt = require('jsonwebtoken');

exports.createAccessToken = (user)  => {
    return jwt.sign({id: user._id}, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: "5m"});
}

exports.createRefreshToken = (user) => {
    return jwt.sign({id: user._id}, `${process.env.REFRESH_TOKEN_SECRET}`);
}
