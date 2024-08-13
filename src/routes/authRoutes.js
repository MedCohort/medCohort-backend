// src/routes/authRoutes.js
const express = require('express');
const { registerClient,registerWriter, login } = require('../controllers/authController');
const router = express.Router();


router.post('/register', registerClient);
router.post('/login', login);
router.post('/writer', registerWriter);

module.exports = router;