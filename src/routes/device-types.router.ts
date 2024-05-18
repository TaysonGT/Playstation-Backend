import { addDeviceType, findDeviceType, allDeviceTypes, updateDeviceType } from '../controllers/devices.contoller';
import {isAdmin} from '../middleware/user.auth'

import express from 'express';
const deviceTypesRouter = express.Router()

deviceTypesRouter.get('/', allDeviceTypes)
deviceTypesRouter.post('/', isAdmin, addDeviceType)
deviceTypesRouter.put('/:id', isAdmin, updateDeviceType)
deviceTypesRouter.get('/:id', findDeviceType)

export default deviceTypesRouter; 