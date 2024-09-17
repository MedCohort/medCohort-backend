const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const assignments = require('../controllers/assignmentsCtr')


router.get('/allAssignments', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Unauthorized access' });
      }
      req.user = user;
      next();
    })(req, res, next);
  }, assignments.allAssignments);
  router.get('/getAssignment/:id', assignments.getAssignmentsById)
router.post('/newAssignment', assignments.newAssignment)
router.put('/updateAssignment/:id', assignments.updateAssignment)
router.delete('/deleteAssignment/:id', assignments.deleteAssignment)

module.exports = router