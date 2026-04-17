import { allOrders, addOrder, deleteOrder, sessionOrders, allOuterOrders } from '../controllers/orders.controller'
import express from 'express';
import { isAdmin } from '../middleware/auth.middleware';
const ordersRouter = express.Router()

ordersRouter.post('/:sessionId', addOrder)
ordersRouter.delete('/:sessionId', isAdmin, deleteOrder)
ordersRouter.get('/:sessionId', sessionOrders)
ordersRouter.get('/outer', allOuterOrders)
ordersRouter.get('/', allOrders)

export default ordersRouter;