import { addDeviceType, findDeviceType, allDeviceTypes, updateDeviceType, deleteDeviceType } from '../controllers/devices.controller';
import {isAdmin} from '../middleware/auth.middleware'

import express from 'express';
const deviceTypesRouter = express.Router()

deviceTypesRouter.get('/', allDeviceTypes)
deviceTypesRouter.post('/', isAdmin, addDeviceType)
deviceTypesRouter.put('/:id', isAdmin, updateDeviceType)
deviceTypesRouter.get('/:id', findDeviceType)
deviceTypesRouter.delete('/:id', deleteDeviceType)

export default deviceTypesRouter; 