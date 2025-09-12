
import express from 'express';
import { addUser, checkUsers, currentSession, userLogin } from '../controllers/users.controller';
const authRouter = express.Router()

authRouter.post('/login', userLogin)
authRouter.post('/firstuser', addUser)
authRouter.get('/firstuser', checkUsers)
authRouter.get('/session', currentSession)

export default authRouter