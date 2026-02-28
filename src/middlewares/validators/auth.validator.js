import { body } from 'express-validator'

const signUpChain = () => [
    body('email')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Use valid email'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('Password Confirmation is required')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),
]

const loginChain = () => [
    body('email')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Use valid email'),
    body('password').notEmpty().withMessage('Password is required'),
]

export { signUpChain, loginChain }
