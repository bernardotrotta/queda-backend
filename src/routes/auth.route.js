import express from 'express'
import { signUp, login } from '../controllers/auth.controller.js'
import {
    signUpChain,
    loginChain,
} from '../middlewares/validators/auth.validator.js'
import { dataValidation } from '../middlewares/validation.middleware.js'

const router = express.Router()

/**
 * Route for user registration.
 * POST /api/auth/signup
 */
router.post('/signup', signUpChain(), dataValidation, signUp)

/**
 * Route for user login.
 * POST /api/auth/login
 */
router.post('/login', loginChain(), dataValidation, login)

export default router
