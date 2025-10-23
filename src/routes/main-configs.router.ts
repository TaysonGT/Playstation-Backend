import { getConfigs, saveConfigs } from '../controllers/main-configs.controller';
import {auth, isAdmin} from '../middleware/user.auth'
import express from 'express';
const configsRouter = express.Router()

configsRouter.get('/', getConfigs)
configsRouter.put('/', auth, isAdmin, saveConfigs)

export default configsRouter