import { 
    allFinances, 
    collectiveRevenue, 
    employeesRevenue, 
    getUsersFinances, 
    playingRevenue, 
    productsRevenue, 
    revenueByPeriod, 
    statisticFinances
} from '../controllers/finances.controller'
import express from 'express';
import { isAdmin } from '../middleware/auth.middleware';

const financeRouter = express.Router()

financeRouter.use(isAdmin)
financeRouter.get('/', allFinances)
financeRouter.get('/playing', playingRevenue);
financeRouter.get('/products', productsRevenue);
financeRouter.get('/revenue', revenueByPeriod);
financeRouter.get('/collective', collectiveRevenue);
financeRouter.get('/users', getUsersFinances)
financeRouter.get('/employees', employeesRevenue)
financeRouter.get('/:user', statisticFinances);

export default financeRouter