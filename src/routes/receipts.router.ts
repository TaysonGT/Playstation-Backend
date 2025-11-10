import {createOuterReceipt, allOuterReceipts, findOuterReceipt, allSessionReceipts, findSessionReceipt, allReceipts, previousReceipts } from '../controllers/receipts.controller'

import express from 'express';
const receiptsRouter = express.Router()

receiptsRouter.get('/', allReceipts)
receiptsRouter.get('/employee', previousReceipts)
receiptsRouter.post('/outer', createOuterReceipt)
receiptsRouter.get('/outer', allOuterReceipts)
receiptsRouter.get('/session', allSessionReceipts)
receiptsRouter.get('/outer/:id', findOuterReceipt)
receiptsRouter.get('/session/:id', findSessionReceipt)

export default receiptsRouter;