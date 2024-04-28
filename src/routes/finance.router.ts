import { allFinances } from '../controllers/finances.controller'

import express from 'express';
const financeRouter = express.Router()

financeRouter.get('/:date', allFinances)

export default financeRouter