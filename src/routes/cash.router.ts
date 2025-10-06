
import express from 'express';
import { allTransactions, currentBalance, makeCollection } from '../controllers/cash.controller';
const cashRouter = express.Router()

cashRouter.post('/collection', makeCollection)
cashRouter.get('/balance', currentBalance)
cashRouter.get('/transactions', allTransactions)

export default cashRouter