
import express from 'express';
import { currentBalance, makeCollection } from '../controllers/cash.controller';
const cashRouter = express.Router()

cashRouter.post('/collection', makeCollection)
cashRouter.get('/balance', currentBalance)

export default cashRouter