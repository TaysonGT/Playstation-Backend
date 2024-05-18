import { allProducts, addProduct, deleteProduct, updateProduct, oneProduct } from '../controllers/products.controller'
import {isAdmin} from '../middleware/user.auth'
import express from 'express';
const productsRouter = express.Router()

productsRouter.get('/', allProducts)
productsRouter.get('/:id', oneProduct)
productsRouter.post('/', isAdmin, addProduct)
productsRouter.put('/:id', isAdmin, updateProduct)
productsRouter.delete('/:id', isAdmin, deleteProduct)

export default productsRouter