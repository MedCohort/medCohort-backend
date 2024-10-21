const express = require('express');
const { validateClientUpdate } = require('../validators/clientValidator');
const router = express.Router();

const clients = require('../controllers/clientController');
const passportConfig = require('../config/passport');

/**
 * @swagger
 * /api/client/allClient:
 *   get:
 *     summary: Retrieve all clients
 *     responses:
 *       200:
 *         description: A list of clients
 *       500:
 *         description: Internal server error
 */
router.get('/allClient', clients.allClient);

/**
 * @swagger
 * /api/client/getClient:
 *   get:
 *     summary: Retrieve a specific client by ID
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Client retrieved successfully
 *       404:
 *         description: Client not found
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get(
    '/getClient',
    passportConfig.authenticate('writer-jwt', { session: false }),
    clients.getClientById
);

/**
 * @swagger
 * /api/client/updateClient/{id}:
 *   put:
 *     summary: Update a client's information
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the client to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullNames:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               tel:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       404:
 *         description: Client not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put('/updateClient/:id', validateClientUpdate, clients.updateClient);

/**
 * @swagger
 * /api/client/deleteClient/{id}:
 *   delete:
 *     summary: Delete a client
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the client to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteClient/:id', clients.deleteClient);

module.exports = router;
