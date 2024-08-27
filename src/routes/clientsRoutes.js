const express = require('express');
const { validateClientUpdate} = require('../validators/clientValidator')
const router = express.Router()

const clients = require('../controllers/clientController')


router.get('/allClient', clients.allClient)
router.get('/getClient/:id', clients.getClientById)
router.put('/updateClient/:id',validateClientUpdate, clients.updateClient)
router.delete('/deleteClient/:id', clients.deleteClient)


module.exports = router