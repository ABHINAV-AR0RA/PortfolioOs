const { body, validationResult } = require('express-validator');

// Handle validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Login validation
const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

// Project validation
const validateProject = [
  body('title').notEmpty().withMessage('Project title is required'),
  body('description').notEmpty().withMessage('Project description is required'),
  handleValidation,
];

// Section validation
const validateSection = [
  body('type').isIn(['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'])
    .withMessage('Invalid section type'),
  handleValidation,
];

module.exports = {
  handleValidation,
  validateLogin,
  validateProject,
  validateSection,
};
