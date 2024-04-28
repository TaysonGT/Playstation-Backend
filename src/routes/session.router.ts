import { addSession, allSessions, findSession, endSession, changeTime } from '../controllers/session.controller'

import express from 'express';
const sessionRouter = express.Router()


sessionRouter.get('/', allSessions)
sessionRouter.put('/:id', changeTime)
sessionRouter.post('/:id', addSession)
sessionRouter.get('/:id', findSession)
sessionRouter.delete('/:id', endSession)

export default sessionRouter;