// src/routes/authRoutes.js
const express = require('express');
const { newClient, login,resetPassword, requestResetPassword } = require('../controllers/authController');
const {validateClientCreation} = require('../validators/clientValidator')

const router = express.Router();


router.post('/registerClient', validateClientCreation,newClient);
router.post('/reset-password/:token', resetPassword); 
router.post('/request-password-reset', requestResetPassword); 
router.post('/loginClient', login);

module.exports = router;