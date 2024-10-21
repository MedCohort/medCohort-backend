const express = require('express');
const {validateWriterCreation,validateWriterUpdate} = require('../validators/writerValidator')
const router  = express.Router();
const passport = require('../config/passport')


const writer = require('../controllers/writerController')


router.get('/allWriters', writer.allWriters);


router.get('/getWriter/:id',
    passportConfig.authenticate('user-jwt', { session: false }),
    writer.getWriterById);

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

router.put('/updateWriter/:id', validateWriterUpdate, writer.updateWriter);

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

router.post('/resetpassword/:token', writer.passSetUp )

router.post('/login', writer.writerLogin)


module.exports = router