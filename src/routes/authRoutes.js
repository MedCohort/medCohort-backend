// src/routes/authRoutes.js
const express = require('express');
const { newClient, login } = require('../controllers/authController');
const {validateClientCreation} = require('../validators/clientValidator')

const router = express.Router();


router.post('/registerClient', validateClientCreation,newClient);
router.post('/loginClient', login);

module.exports = router;