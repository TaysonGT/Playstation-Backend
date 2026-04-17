import { findDevice, allDevices, addDevice, updateDevice, deleteDevice} from "../controllers/devices.controller";
import {isAdmin} from '../middleware/auth.middleware'

import express from 'express';
const devicesRouter = express.Router()

devicesRouter.get('/', allDevices) 
devicesRouter.get('/:id', findDevice)

devicesRouter.use(isAdmin)
devicesRouter.post('/', addDevice)
devicesRouter.post('/:id', updateDevice)
devicesRouter.delete('/:id', deleteDevice)

export default devicesRouter;