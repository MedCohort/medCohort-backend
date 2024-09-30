const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminCrl');
const { validateAdminCreation } = require('../validators/adminValidator');

/**
 * @swagger
 * /api/admin/allAdmins:
 *   get:
 *     summary: Retrieve a list of all admins
 *     responses:
 *       200:
 *         description: A list of admins
 *       500:
 *         description: Internal server error
 */
router.get('/allAdmins', adminController.allAdmins); // Ensure this matches the export

/**
 * @swagger
 * /api/admin/addAdmin:
 *   post:
 *     summary: Add a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the admin
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The email of the admin
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The password for the admin
 *                 example: securePassword123
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Bad request, validation errors
 *       500:
 *         description: Internal server error
 */
router.post('/addAdmin', validateAdminCreation, adminController.newAdmin);

module.exports = router;