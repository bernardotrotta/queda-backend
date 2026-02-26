import express from 'express'
import { signUp, login } from '../controllers/auth.controller.js'
import {
    signUpChain,
    loginChain,
    dataValidation,
} from '../middlewares/validators/auth.validator.js'

const router = express.Router()

router.post('/signup', signUpChain(), dataValidation, signUp)
router.post('/login', loginChain(), dataValidation, login)

export default router
