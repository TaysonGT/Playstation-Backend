import { allProducts, addProduct, deleteProduct, updateProduct, oneProduct } from '../controllers/products.controller'

import express from 'express';
const productsRouter = express.Router()

productsRouter.get('/', allProducts)
productsRouter.get('/:id', oneProduct)
productsRouter.post('/', addProduct)
productsRouter.put('/:id', updateProduct)
productsRouter.delete('/:id', deleteProduct)

export default productsRouter