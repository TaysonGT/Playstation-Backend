
import express from 'express';
import { currentBalance, makeCollection, cashReport, collectionsList } from '../controllers/cash.controller';
const cashRouter = express.Router()

cashRouter.post('/collections', makeCollection)
cashRouter.get('/collections', collectionsList)
cashRouter.get('/balance', currentBalance)
cashRouter.get('/report', cashReport)

export default cashRouter