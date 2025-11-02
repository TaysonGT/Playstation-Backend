import {
  allUsers,
  findUser,
  updateUser,
  deleteUser,
  addUser,
} from '../controllers/users.controller'
import {isAdmin} from '../middleware/auth.middleware'
import express from 'express';
const userRouter = express.Router()

userRouter.use(isAdmin);
userRouter.get('/', allUsers);
userRouter.get('/:id', findUser);
userRouter.delete('/:id', deleteUser);
userRouter.put('/:id', updateUser);
userRouter.post('/', addUser);

export default userRouter;