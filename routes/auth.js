const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const {verifyAuth} = require('../controllers/TokenController');

router.use(express.json());

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh)
router.post('/logout', AuthController.logout);

//Protected route for testing verification
router.get('/protected', verifyAuth, (req, res) => {
   res.json("protected stuff");
})

module.exports = router;
