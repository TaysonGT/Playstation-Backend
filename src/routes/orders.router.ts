import { allOrders, addOrder, deleteOrder, sessionOrders, allOuterOrders } from '../controllers/orders.controller'
import express from 'express';
const ordersRouter = express.Router()

ordersRouter.post('/:sessionId', addOrder)
ordersRouter.delete('/:sessionId', deleteOrder)
ordersRouter.get('/outer', allOuterOrders)
ordersRouter.get('/:id', sessionOrders)
ordersRouter.get('/', allOrders)

export default ordersRouter;