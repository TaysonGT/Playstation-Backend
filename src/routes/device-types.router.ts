import { addDeviceType, findDeviceType, allDeviceTypes, updateDeviceType } from '../controllers/devices.contoller';

import express from 'express';
const deviceTypesRouter = express.Router()

deviceTypesRouter.get('/', allDeviceTypes)
deviceTypesRouter.post('/', addDeviceType)
deviceTypesRouter.put('/:id', updateDeviceType)
deviceTypesRouter.get('/:id', findDeviceType)

export default deviceTypesRouter; 