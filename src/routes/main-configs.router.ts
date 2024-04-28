import { getConfigs, saveConfigs } from '../controllers/main-configs.controller';

import express from 'express';
const configsRouter = express.Router()

configsRouter.get('/', getConfigs)
configsRouter.put('/', saveConfigs)

export default configsRouter