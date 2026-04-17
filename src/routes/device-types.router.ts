import { addDeviceType, findDeviceType, allDeviceTypes, updateDeviceType, deleteDeviceType } from '../controllers/devices.controller';
import {isAdmin} from '../middleware/auth.middleware'

import express from 'express';
const deviceTypesRouter = express.Router()

deviceTypesRouter.get('/', allDeviceTypes)
deviceTypesRouter.get('/:id', findDeviceType)

deviceTypesRouter.use(isAdmin)
deviceTypesRouter.post('/', addDeviceType)
deviceTypesRouter.put('/:id', updateDeviceType)
deviceTypesRouter.delete('/:id', deleteDeviceType)

export default deviceTypesRouter; 