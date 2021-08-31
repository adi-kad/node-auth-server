const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');
const {createAccessToken, createRefreshToken} = require('../controllers/TokenController');

exports.register = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);    

    try {
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        });

        //assign tokens to user
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);         
        res.status(200).json({
            user,
            accessToken: accessToken,
            refreshToken: refreshToken
        });      
        //save new refresh token to collection
        await new Token({token: refreshToken}).save();
    } catch (error) {
        return res.status(400).json(error.message);        
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(400).json({message: "Email or password is incorrect."});
        }
        //if user enters valid password
        if (await bcrypt.compare(password, user.password)) {        
            //assign tokens
            const accessToken = createAccessToken(user);
            const refreshToken = createRefreshToken(user);           
            res.status(200).json({
                user: user._id,                
                accessToken: accessToken,
                refreshToken: refreshToken
            });        
            //save refresh token to collection
            await new Token({token: refreshToken}).save();
        } else { 
            return res.status(400).json({message: "Email or password is incorrect."});
        }    
    } catch (error) {
        console.log(error);
        res.status(401).json(error.message);
    }   
}

exports.refresh =  async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({message: "Token is required"});
    }

    const refToken = await Token.findOne({token: refreshToken});    
    if (!refToken) {
        return res.status(400).json({message: "Access denied. Valid token is required"});
    }

    jwt.verify(refToken.token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(401).json({message: "Invalid access token"});
        }
        //delete old refresh token
        await Token.findOneAndDelete({token: refToken.token })        
        //assign new tokens
        const newAccessToken = createAccessToken(user);
        const newRefreshToken = createRefreshToken(user);        
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });    
        //save new refresh token
        await new Token({token: newRefreshToken}).save();
    });    
}

exports.logout = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    try {
        //Removing refresh token when user logs out
        await Token.findOneAndDelete({ token: refreshToken });
        res.status(200).json("User logged out successfully");
    } catch (error) {
        res.status(500).json({error: error});
    }
}