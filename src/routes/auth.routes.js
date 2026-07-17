import { Router } from 'express'
import { register, verifyEmail, login, getMe } from '../controllers/auth.controller.js'
import { registerValidator, loginValidator } from '../validators/auth.validator.js'
import { validate } from '../middlewares/validation.middleware.js'
import { authUser } from '../middlewares/auth.middle.ware.js'

const authRouter = Router();

authRouter.post('/register', registerValidator, validate, register)

authRouter.post('/login', loginValidator, validate, login)

authRouter.get('/get-me', authUser, getMe);


authRouter.get('/verify-email', verifyEmail);



export default authRouter;
