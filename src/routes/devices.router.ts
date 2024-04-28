import { findDevice, allDevices, addDevice, updateDevice, deleteDevice} from "../controllers/devices.contoller";

import express from 'express';
const devicesRouter = express.Router()


devicesRouter.get('/', allDevices) 
devicesRouter.post('/', addDevice)
devicesRouter.post('/:id', updateDevice)
devicesRouter.delete('/:id', deleteDevice)
devicesRouter.get('/:id', findDevice)

export default devicesRouter;