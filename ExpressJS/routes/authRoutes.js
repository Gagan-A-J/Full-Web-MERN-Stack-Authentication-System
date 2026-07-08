const express = require('express');
const { signup, login, logout, reqresetpassword, resetpassword, verify } = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
//router.post('/google-oauth-login', googleOAuthLogin);
router.post('/logout', logout);
router.post('/forgot-password', reqresetpassword);
router.post('/reset-password/:token', resetpassword);
router.post('/verify-otp', verify)

module.exports = router;