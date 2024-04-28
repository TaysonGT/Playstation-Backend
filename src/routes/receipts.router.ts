import {createOuterReceipt, allOuterReceipts, findOuterReceipt } from '../controllers/receipts.controller'

import express from 'express';
const receiptsRouter = express.Router()

receiptsRouter.post('/', createOuterReceipt)
receiptsRouter.get('/', allOuterReceipts)
receiptsRouter.get('/:id', findOuterReceipt)

export default receiptsRouter;