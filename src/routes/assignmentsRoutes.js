const express = require('express')
const router = express.Router()

const assignments = require('../controllers/assignmentsCtr')


router.get('/allAssignments', assignments.allAssignments)
router.get('/getAssignment/:id', assignments.getAssignmentsById)
router.post('/newAssignment', assignments.newAssignment)
router.put('/updateAssignment/:id', assignments.updateAssignment)
router.delete('/deleteAssignment/:id', assignments.deleteAssignment)

module.exports = router