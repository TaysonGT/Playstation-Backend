import {
    deleteUser,
    addUser,
} from '../controllers/users.controller'

import express from 'express';
const userRouter = express.Router()

userRouter.delete('/delete', deleteUser)
userRouter.post('/add', addUser)


export default userRouter;