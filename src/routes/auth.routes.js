import { Router } from 'express'
import { register } from '../controllers/auth.controller.js'
import { registerValidator } from '../validators/auth.validator.js'
import { validate } from '../middlewares/validation.middleware.js'

const authRouter = Router();

authRouter.post('/register', registerValidator, validate, register)

export default authRouter;


