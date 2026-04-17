
import express from 'express';
import { currentBalance, makeCollection, cashReport, collectionsList } from '../controllers/cash.controller';
import { isAdmin } from '../middleware/auth.middleware';
const cashRouter = express.Router()

cashRouter.use(isAdmin)
cashRouter.post('/collections', makeCollection)
cashRouter.get('/collections', collectionsList)
cashRouter.get('/balance', currentBalance)
cashRouter.get('/report', cashReport)

export default cashRouter