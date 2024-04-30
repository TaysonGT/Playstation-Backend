import { addSession, allSessions, findSession, endSession, changePlayType, changeDevice } from '../controllers/session.controller'

import express from 'express';
const sessionRouter = express.Router()


sessionRouter.get('/', allSessions)
sessionRouter.put('/play-type/:id', changePlayType)
sessionRouter.put('/change-device/:id', changeDevice)
sessionRouter.post('/:id', addSession)
sessionRouter.get('/:id', findSession)
sessionRouter.delete('/:id', endSession)

export default sessionRouter;