import { body } from 'express-validator'

const usernameChain = () => body('username').notEmpty()
const passwordChain = () => body('password').notEmpty()
const confirmPasswordChain = () =>
    body('confirmPassword')
        .notEmpty()
        .withMessage('Password Confirmation is required')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match')
const typeChain = () => {
    body('type')
        .notEmpty()
        .withMessage('Type is required')
        .isIn(['password', 'username'])
        .withMessage('Type not valid')
}
export { usernameChain, passwordChain, confirmPasswordChain, typeChain }
