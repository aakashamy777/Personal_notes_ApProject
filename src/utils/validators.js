const { body } = require('express-validator');

const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const noteValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
];

module.exports = { registerValidation, loginValidation, noteValidation };
