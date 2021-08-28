const jwt = require('jsonwebtoken');

exports.createAccessToken = (user)  => {
    return jwt.sign({id: user._id}, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: "1min"});
}

exports.createRefreshToken = (user) => {
    return jwt.sign({id: user._id}, `${process.env.REFRESH_TOKEN_SECRET}`);
}

exports.verifyAuth = (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        return res.status(401).json({message: "No access token"});        
    };
    
    // Value example = 'Bearer accestoken231231221'
    const token = bearer.split(" ")[1];               
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);        
        req.user = verified.user;
        next();
    } catch (err) {
        return res.status(400).json(err);
    };
}