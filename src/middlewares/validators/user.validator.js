import { body } from 'express-validator'

/**
 * Validates that username is present in request body.
 * @returns {Object} Express-validator body check.
 */
const usernameChain = () => body('username').notEmpty()

/**
 * Validates that password is present in request body.
 * @returns {Object} Express-validator body check.
 */
const passwordChain = () => body('password').notEmpty()

/**
 * Validates that confirmPassword matches password in request body.
 * @returns {Object} Express-validator body check with custom matcher.
 */
const confirmPasswordChain = () =>
    body('confirmPassword')
        .notEmpty()
        .withMessage('Password Confirmation is required')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match')

/**
 * Validates that 'type' is present and is either 'password' or 'username'.
 * @returns {Object} Express-validator body check with whitelist.
 */
const typeChain = () => {
    body('type')
        .notEmpty()
        .withMessage('Type is required')
        .isIn(['password', 'username'])
        .withMessage('Type not valid')
}

export { usernameChain, passwordChain, confirmPasswordChain, typeChain }
