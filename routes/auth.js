const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.use(express.json());

router.get('/', (req, res) => {
    res.send("Auth route");
})

router.post('/register', async (req, res) => {
    const {email, username, password} = req.body;

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);    
    
    try {
        const user = await User.create({
            email: email,
            username: username,
            password: hashedPassword
        });
        console.log("User created succesfully", user);
        res.status(200).send({user});
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);        
    };
})

module.exports = router;