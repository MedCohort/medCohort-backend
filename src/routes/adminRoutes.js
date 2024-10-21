const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminCrl');
const { validateAdminCreation } = require('../validators/adminValidator');
const passport = require('../config/passport')


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
router.post('/auth/addAdmin', validateAdminCreation, adminController.newAdmin);

router.post('/auth/adminLogin', adminController.adminLogin)

// router.get('/dash', adminController.adminDashView)

router.get('/dash', (req, res, next) => {
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
}, adminController.adminDashView);


router.post('/delegate' , (req, res, next) => {
        passport.authenticate('admin-jwt', { session: false }, (err, admin, info) => {
            if (err) {
                console.error('Error during authentication:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
    
            if (!admin) {  
                console.warn('Authentication failed:', info);
                return res.status(401).json({ message: 'Unauthorized access' });
            }
    
           
            if (admin.role !== 'admin') {
                return res.status(403).json({ message: 'Forbidden: Access denied' });
            }
    
            
            req.user = admin;
            next();
        })(req, res, next);
    },adminController.delegateAssgnmt)

router.get('/test', adminController.testPost)

module.exports = router;