// src/routes/authRoutes.js
const express = require('express');
const { newClient, login, resetPassword, requestResetPassword, checkAuth, logOut } = require('../controllers/authController');
const { validateClientCreation } = require('../validators/clientValidator');

const router = express.Router();

/**
 * @swagger
 * /auth/registerClient:
 *   post:
 *     summary: Register a new client
 *     description: This endpoint allows a new client to register by providing their details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullNames:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Client registered successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/registerClient', validateClientCreation, newClient);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset password
 *     description: This endpoint allows a client to reset their password using a token.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The token for password reset
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or input data
 */
router.post('/reset-password/:token', resetPassword);

/**
 * @swagger
 * /auth/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     description: This endpoint allows a client to request a password reset link.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       404:
 *         description: Email not found
 */
router.post('/request-password-reset', requestResetPassword);

/**
 * @swagger
 * /auth/loginClient:
 *   post:
 *     summary: Log in a client
 *     description: This endpoint allows a client to log in using their credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/loginClient', login);

/**
 * @swagger
 * /auth/checkAuth:
 *   get:
 *     summary: Check authentication status
 *     description: This endpoint checks if the client is authenticated.
 *     responses:
 *       200:
 *         description: Client is authenticated
 *       401:
 *         description: Client is not authenticated
 */
router.get('/checkAuth', checkAuth);

/**
 * @swagger
 * /auth/logoutClt:
 *   post:
 *     summary: Log out a client
 *     description: This endpoint allows a client to log out.
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logoutClt', logOut);

module.exports = router;