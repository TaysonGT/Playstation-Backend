import { findDevice, allDevices, addDevice, updateDevice, deleteDevice} from "../controllers/devices.controller";
import {isAdmin} from '../middleware/user.auth'

import express from 'express';
const devicesRouter = express.Router()

devicesRouter.get('/', allDevices) 
devicesRouter.post('/', isAdmin, addDevice)
devicesRouter.post('/:id', isAdmin, updateDevice)
devicesRouter.delete('/:id', isAdmin, deleteDevice)
devicesRouter.get('/:id', findDevice)

export default devicesRouter;