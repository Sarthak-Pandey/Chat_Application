import { Router } from 'express'
import { register, verifyEmail, login } from '../controllers/auth.controller.js'
import { registerValidator, loginValidator } from '../validators/auth.validator.js'
import { validate } from '../middlewares/validation.middleware.js'

const authRouter = Router();

authRouter.post('/register', registerValidator, validate, register)

authRouter.post('/login', loginValidator, validate, login)

authRouter.get('/verify-email', verifyEmail);



export default authRouter;
