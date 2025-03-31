const express = require('express');
const { 
    login, 
    logout, 
    signup, 
    verifyEmail, 
    forgotPassword, 
    resetPassword, 
    checkAuth 
} = require('../controllers/AuthController');
const { verifyToken } = require('../middleware/verifytoken');

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

module.exports = router;
