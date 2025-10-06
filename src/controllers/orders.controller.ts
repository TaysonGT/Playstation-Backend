import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { Order } from "../entity/order.entity";
import { Product } from './../entity/product.entity';
import { addProductDto } from "../dto/add-product.dto";
import { Session } from "../entity/session.entity";
import { editOrderDto } from "../dto/add-order.dto";
import { IsNull } from "typeorm"

const orderRepo = myDataSource.getRepository(Order)
const sessionRepo = myDataSource.getRepository(Session)
const productRepo = myDataSource.getRepository(Product)

const allOrders = async (req:Request, res:Response)=>{
    const orders = await orderRepo.find()
    res.json({orders})
}

const allOuterOrders =  async (req:Request, res:Response)=>{
    const orders = await orderRepo.find({where:{session: IsNull()}})
    res.json({orders})
}

const sessionOrders = async (req:Request, res:Response)=>{
    const {sessionId} = req.params
    const session = await sessionRepo.createQueryBuilder('session')
    .leftJoinAndSelect('session.orders', 'orders')
    .leftJoinAndSelect('orders.product', 'product')
    .leftJoinAndSelect('session.time_orders', 'time_orders')
    .where('session.id = :id', {id: sessionId})
    .getOne()

    if(!session){
        res.status(404).json({success: false, message: "الجلسة غير موجودة"})
        return;
    }
    
    let cummulatedOrders:{
        product: Product;
        cost: number;
        quantity: number
    }[] = [];
    
    session.orders.map((order)=>{        
        let found = false;

        cummulatedOrders.map((cummulatedOrder)=>{
            if(order.product.id === cummulatedOrder.product.id){
                found = true
                return{
                    ...cummulatedOrder,
                    cost: cummulatedOrder.cost + order.cost,
                    quantity: cummulatedOrder.quantity + order.quantity
                }
            }
            return cummulatedOrder;
        })

        if(!found){
            let cummulatedOrder = {
                product: order.product,
                cost: order.cost,
                quantity: order.quantity
            }
            cummulatedOrders.push(cummulatedOrder)
        }    
    })

    const timeOrdersWithString = session.time_orders?.map((order)=>{
        let time = Math.floor((new Date(order.ended_at).getTime() - new Date(order.started_at).getTime()) /1000)
        const hours = Math.floor(time / (60*60))
        const minutes = Math.floor(time/(60)) % 60
        const seconds = time % 60
    
        let strHours = hours>9? hours : `0${hours}`
        let strMinutes = minutes>9? minutes : `0${minutes}`
        let strSeconds = seconds>9? seconds : `0${seconds}`
    
        let timeString = (`${strHours}:${strMinutes}:${strSeconds}`)        
        return {...order, time: timeString}
    })
  
    res.json({orders: cummulatedOrders, time_orders: timeOrdersWithString})
}

const addOrder = async(req: Request, res: Response)=>{
    const {product_id, quantity} = req.body;
    const {sessionId} = req.params;
    const session = await sessionRepo.findOne({where:{id: sessionId}, relations:{device:true}})
    const product = await productRepo.findOne({where:{id: product_id}})

    if(!product){
        res.json({success: false, message: "حدث خطأ"})
        return;
    }

    if(!session){
        res.json({success: false, message: "الجلسة غير موجودة"})
        return;
    }

    const existingOrderedProd = await orderRepo.findOne({where:{product: {id:product_id}, session: {id: sessionId}}})
    const cost = product.price * quantity;
    let savedOrder: any = {}
    if(existingOrderedProd){
        const updateOrderedProd:editOrderDto = {...existingOrderedProd, cost: existingOrderedProd.cost + cost , quantity: existingOrderedProd.quantity + parseInt(quantity)}
        savedOrder = await orderRepo.save(updateOrderedProd);
    }else{
        const order = orderRepo.create({product, quantity, session, cost})
        savedOrder = await orderRepo.save(order)
    }

    const stock = product.stock - quantity;
    const updateProductsData:addProductDto = Object.assign(product, {stock}) 
    const updatedProducts = await productRepo.save(updateProductsData)
    res.json({success: true, savedOrder, updatedProducts, message: "تمت إضافةالطلب بنجاح"})
}

const deleteOrder = async(req: Request, res: Response)=>{
    const {id} = req.params
    const order = await orderRepo.findOne({where: {id}})
    if(!order) {
        res.json({success: false, message: "هذا الطلب غير موجود"})
        return;
    }

    const product = await productRepo.findOne({where:{id: order?.product.id}})
    await orderRepo.remove(order)

    if(product){
        const stock = product.stock - order.quantity;
        const updateProductsData:addProductDto = Object.assign(product, {stock}) 
        await productRepo.save(updateProductsData)
    }

    res.json({success: true, message: "تم حذف الطلب بنجاح"})
}


export {
    allOrders,
    sessionOrders,
    allOuterOrders,
    addOrder,
    deleteOrder
}