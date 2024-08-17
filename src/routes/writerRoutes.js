const express = require('express');
const {validateWriterCreation,validateWriterUpdate} = require('../validators/writerValidator')
const router  = express.Router();

const writer = require('../controllers/writerController')


router.get('/allWriters', writer.allWriters);
router.get('/getWriter/:id', writer.getWriterById);
router.post('/newWriter', validateWriterCreation, writer.newWriter);
router.put('/updateWriter/:id', validateWriterUpdate, writer.updateWriter);
router.delete('/deleteWriter/:id', writer.deleteWriter);


module.exports = router