// src/routes/authRoutes.js
const express = require('express');
const { newClient, login,resetPassword, requestResetPassword,checkAuth,logOut } = require('../controllers/authController');
const {validateClientCreation} = require('../validators/clientValidator')

const router = express.Router();


router.post('/registerClient', validateClientCreation,newClient);
router.post('/reset-password/:token', resetPassword); 
router.post('/request-password-reset', requestResetPassword); 
router.post('/loginClient', login);
router.get('/checkAuth', checkAuth);
router.post('/logoutClt', logOut)

module.exports = router;