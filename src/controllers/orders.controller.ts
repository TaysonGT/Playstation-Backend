import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { Order } from "../entity/order.entity";
import { Product } from './../entity/product.entity';
import { Device } from "../entity/device.entity";
import { addProductDto } from "../dto/add-product.dto";
import { TimeOrder } from "../entity/time-order.entity";
import { Session } from "../entity/session.entity";
import { addOrderDto } from "../dto/add-order.dto";

const orderRepo = myDataSource.getRepository(Order)
const sessionRepo = myDataSource.getRepository(Session)
const timeOrderRepo = myDataSource.getRepository(TimeOrder)
const deviceRepo = myDataSource.getRepository(Device)
const productRepo = myDataSource.getRepository(Product)

const allOrders = async (req:Request, res:Response)=>{
    const orders = await orderRepo.find()
    res.json({orders})
}

const allOuterOrders =  async (req:Request, res:Response)=>{
    const orders = await orderRepo.find()
    let outerOrders = orders.filter((order)=> order.device_session_id == null)
    res.json({outerOrders})
}

const sessionOrders = async (req:Request, res:Response)=>{
    const {id} = req.params
    const orders = await orderRepo.find({where:{device_session_id: id}})
    const timeOrders = await timeOrderRepo.find({where:{session_id: id}})
    const products = await productRepo.find()
    
    let arrangedOrders:object[] = [];
    
    products.map((product)=>{
        let entity = {
            product: "",
            cost: 0,
            quantity:0
        }

        const collected = orders.filter((order)=> order.product_id == product.id)
        if(collected.length>0){
            entity.product = product.name
            collected.map((order)=> {
                entity.cost += order.cost
                entity.quantity+= order.quantity
            })
            arrangedOrders.push(entity)
        }
    })
  
    res.json({orders, timeOrders, arrangedOrders})
}

const addOrder = async(req: Request, res: Response)=>{
    const {product_id, quantity} = req.body;
    const {sessionId} = req.params ;
    const session = await sessionRepo.findOne({where:{id: sessionId}})
    const device = await deviceRepo.findOne({where:{id:session?.device_id}})
    const product = await productRepo.findOne({where:{id: product_id}})

    if(product && device){ 
        const existingOrderedProd = await orderRepo.findOne({where:{product_id, device_session_id: sessionId}})
        const cost = product.price * quantity;
        let savedOrder: any = {}
        if(existingOrderedProd){
            const updateOrderedProd:addOrderDto = Object.assign(existingOrderedProd, {cost: existingOrderedProd.cost + cost , quantity: existingOrderedProd.quantity + parseInt(quantity)})     
            savedOrder = await orderRepo.save(updateOrderedProd);
        }else{
            let orderData:addOrderDto  = {product_id, product_name:product.name , quantity, device_session_id:sessionId, device_name: device.name, cost}
            const order = orderRepo.create(orderData)
            savedOrder = await orderRepo.save(order)
        }
        const stock = product.stock - quantity;
        const consumed = product.consumed + quantity;
        const updateProductsData:addProductDto = Object.assign(product, {stock, consumed}) 
        const updatedProducts = await productRepo.save(updateProductsData)
        res.json({success: true, savedOrder, updatedProducts, message: "تمت إضافةالطلب بنجاح"})
    }else res.json({success: false, message: "حدث خطأ"})
}

const deleteOrder = async(req: Request, res: Response)=>{
    const {id} = req.params
    const order = await orderRepo.findOne({where: {id}})
    const product = await productRepo.findOne({where:{id: order?.product_id}})
    if(order && product){
        const deleted = await orderRepo.remove(order)
        const stock = product.stock - order.quantity;
        const consumed = product.consumed + order.quantity;
        const updateProductsData:addProductDto = Object.assign(product, {stock, consumed}) 
        const updatedProducts = await productRepo.save(updateProductsData)

        res.json({success: true, deleted, updatedProducts, message: "تم حذف الطلب بنجاح"})
    }else{
        res.json({success: false, message: "هذا الطلب غير موجود"})
    }
}


export {
    allOrders,
    sessionOrders,
    allOuterOrders,
    addOrder,
    deleteOrder
}