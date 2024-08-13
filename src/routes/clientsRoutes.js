const express = require('express');
const router = express.Router()

const clients = require('../controllers/client')


router.get('/allClient', clients.allClient)


module.exports = router