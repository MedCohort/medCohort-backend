const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminCrl');
const { validateAdminCreation} = require('../validators/adminValidator')

router.get('/allAdmins', adminController.allAdmins); // Ensure this matches the export
router.post('/addAdmin', validateAdminCreation,adminController.newAdmin);



module.exports = router;