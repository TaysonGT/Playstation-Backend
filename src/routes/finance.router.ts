import { allFinances, getUsersFinances, addDeduction, removeDeduction,
statisticFinances } from '../controllers/finances.controller'

import express from 'express';
const financeRouter = express.Router()

financeRouter.get('/', allFinances)
financeRouter.get('/users', getUsersFinances)
financeRouter.post('/deduction', addDeduction);
financeRouter.delete('/deduction/:id', removeDeduction);
financeRouter.get('/:date/:user', statisticFinances);

export default financeRouter