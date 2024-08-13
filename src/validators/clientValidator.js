const { body } = require('express-validator');



const validateClientCreation = [
    body('fullNames').notEmpty().withMessage('Fullname is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];

const validateClientUpdate = [
    body('fullNames').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
  
  module.exports = {
    validateClientCreation,
    validateClientUpdate
  };