import { 
    allFinances, 
    collectiveRevenue, 
    employeesRevenue, 
    getUsersFinances, 
    playingRevenue, 
    productsRevenue, 
    revenueByPeriod, 
    // addDeduction, removeDeduction,
    statisticFinances
} from '../controllers/finances.controller'

import express from 'express';
const financeRouter = express.Router()

financeRouter.get('/', allFinances)
financeRouter.get('/playing', playingRevenue);
financeRouter.get('/products', productsRevenue);
financeRouter.get('/revenue', revenueByPeriod);
financeRouter.get('/collective', collectiveRevenue);
financeRouter.get('/users', getUsersFinances)
financeRouter.get('/employees', employeesRevenue)
// financeRouter.post('/deduction', addDeduction);
// financeRouter.delete('/deduction/:id', removeDeduction);
financeRouter.get('/:user', statisticFinances);

export default financeRouter