const { body } = require('express-validator');


const validateWriterCreation = [
    body('name').notEmpty().withMessage('Fullname is required'),
    body('email').isEmail().withMessage('Invalid email address'),
  ];

  const validateWriterUpdate = [
    body('name').notEmpty().withMessage('Fullname is required'),
    body('email').isEmail().withMessage('Invalid email address'),
  ];
  module.exports = {
    validateWriterCreation,
    validateWriterUpdate
  }