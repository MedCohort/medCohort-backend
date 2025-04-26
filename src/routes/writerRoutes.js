const express = require('express');
const {validateWriterCreation,validateWriterUpdate} = require('../validators/writerValidator')
const router  = express.Router();
const passport = require('../config/passport')


const writer = require('../controllers/writerController')

/**
 * @swagger
 * tags:
 *   name: Writers
 *   description: API for managing writers
 */



/**
 * @swagger
 * /allWriters:
 *   get:
 *     summary: Retrieve a list of all writers
 *     tags: [Writers]
 *     responses:
 *       200:
 *         description: A list of writers
 *       500:
 *         description: Internal server error
 */
router.get('/allWriters', writer.allWriters);

/**
 * @swagger
 * /getWriter/{id}:
 *   get:
 *     summary: Retrieve a writer by ID
 *     tags: [Writers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the writer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Writer details
 *       404:
 *         description: Writer not found
 *       500:
 *         description: Internal server error
 */
router.get('/getWriter/:id',
    passport.authenticate('user-jwt', { session: false }),
    writer.getWriterById);


/**
 * @swagger
 * /newWriter:
 *   post:
 *     summary: Create a new writer
 *     tags: [Writers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Writer created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden: Access denied
 *       500:
 *         description: Internal server error
 */    
router.post('/newWriter', validateWriterCreation , (req, res, next) => {
    passport.authenticate('admin-jwt', { session: false }, (err, admin, info) => {
        if (err) {
            console.error('Error during authentication:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!admin) {  // Ensure the variable is 'admin', not 'user'
            console.warn('Authentication failed:', info);
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        // Check if the authenticated user is an admin
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }

        // Attach the admin to the request object and proceed to the next middleware
        req.user = admin;
        next();
    })(req, res, next);
}, writer.newWriter);


/**
 * @swagger
 * /updateWriter/{id}:
 *   put:
 *     summary: Update a writer by ID
 *     tags: [Writers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the writer
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Writer updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Writer not found
 *       500:
 *         description: Internal server error
 */
router.put('/updateWriter/:id', validateWriterUpdate, writer.updateWriter);


/**
 * @swagger
 * /deleteWriter/{id}:
 *   delete:
 *     summary: Delete a writer by ID
 *     tags: [Writers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the writer
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Writer deleted successfully
 *       404:
 *         description: Writer not found
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden: Access denied
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteWriter/:id', (req, res, next) => {
    passport.authenticate('admin-jwt', { session: false }, (err, admin, info) => {
        if (err) {
            console.error('Error during authentication:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!admin) {  // Ensure the variable is 'admin', not 'user'
            console.warn('Authentication failed:', info);
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        // Check if the authenticated user is an admin
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }

        // Attach the admin to the request object and proceed to the next middleware
        req.user = admin;
        next();
    })(req, res, next);
}, writer.deleteWriter);


/**
 * @swagger
 * /resetpassword/{token}:
 *   post:
 *     summary: Reset password for a writer
 *     tags: [Writers]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: The reset token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/resetpassword/:token', writer.passSetUp )


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a writer
 *     tags: [Writers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.post('/login', writer.writerLogin)


/**
 * @swagger
 * /submission:
 *   post:
 *     summary: Create a submission for a writer
 *     tags: [Writers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Submission created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden: Access denied
 *       500:
 *         description: Internal server error
 */
router.post('/submission',(req, res, next) => {
    passport.authenticate('writer-jwt', { session: false }, (err, writer, info) => {
        if (err) {
            console.error('Error during authentication:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!writer) {  
            console.warn('Authentication failed:', info);
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        // Check if the authenticated user is an admin
        if (writer.role !== 'writer') {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }

        // Attach the admin to the request object and proceed to the next middleware
        req.user = writer;
        next();
    })(req, res, next);
}, writer.createSubmission)


module.exports = router