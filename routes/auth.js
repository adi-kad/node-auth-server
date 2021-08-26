const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');
const {createAccessToken, createRefreshToken} = require('../tokens');

router.use(express.json());

router.get('/', (req, res) => {
    res.send("Auth route");
})

router.post('/register', async (req, res) => {
    const {email, password} = req.body;

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);    
    
    try {
        const user = await User.create({
            email: email,
            password: hashedPassword
        });
        console.log("User created succesfully", user);
        res.status(200).json({user});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);        
    };
})

router.post('/login', async (req, res) => {
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
            const refreshTokenCollection = new Token({token: refreshToken});
            await refreshTokenCollection.save();

        } else { 
            return res.status(400).json({message: "Email or password is incorrect."});
        }    
    } catch (error) {
        console.log(error);
        res.status(401).json(error.message);
    }   
})

module.exports = router;