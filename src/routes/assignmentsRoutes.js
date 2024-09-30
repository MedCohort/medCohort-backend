const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const assignments = require('../controllers/assignmentsCtr')


/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: API endpoints for managing assignments
 */

/**
 * @swagger
 * /api/assignments/allAssignments:
 *   get:
 *     summary: Retrieve all assignments
 *     tags: [Assignments]
 *     responses:
 *       200:
 *         description: A list of assignments
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/allAssignments', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Unauthorized access' });
      }
      req.user = user;
      next();
    })(req, res, next);
  }, assignments.allAssignments);

/**
 * @swagger
 * /api/assignments/getAssignment/{id}:
 *   get:
 *     summary: Retrieve a specific assignment by ID
 *     tags: [Assignments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the assignment to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assignment retrieved successfully
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
router.get('/getAssignment/:id', assignments.getAssignmentsById);

/**
 * @swagger
 * /api/assignments/newAssignment:
 *   post:
 *     summary: Create a new assignment
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               instructions:
 *                 type: string
 *               files:
 *                 type: string
 *               pages:
 *                 type: integer
 *               typeOfPaper:
 *                 type: string
 *               discipline:
 *                 type: string
 *               qualityLevel:
 *                 type: string
 *               format:
 *                 type: string
 *               sources:
 *                 type: integer
 *               clientId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/newAssignment', assignments.newAssignment);

/**
 * @swagger
 * /api/assignments/updateAssignment/{id}:
 *   put:
 *     summary: Update an existing assignment
 *     tags: [Assignments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the assignment to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               instructions:
 *                 type: string
 *               files:
 *                 type: string
 *               pages:
 *                 type: integer
 *               typeOfPaper:
 *                 type: string
 *               discipline:
 *                 type: string
 *               qualityLevel:
 *                 type: string
 *               format:
 *                 type: string
 *               sources:
 *                 type: integer
 *               clientId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
router.put('/updateAssignment/:id', assignments.updateAssignment);

/**
 * @swagger
 * /api/assignments/deleteAssignment/{id}:
 *   delete:
 *     summary: Delete an assignment
 *     tags: [Assignments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the assignment to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteAssignment/:id', assignments.deleteAssignment);

module.exports = router