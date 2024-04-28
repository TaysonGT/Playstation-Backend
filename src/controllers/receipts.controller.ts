import { Response, Request } from "express";
import { Receipt } from "../entity/reciept.entity";
import { Product } from "../entity/product.entity";
import { addProductDto } from "../dto/add-product.dto";
import { myDataSource } from "../app-data-source";
import { TimeReceipt } from "../entity/time-receipt.entity";
import { Finance } from "../entity/finances.entity";
import { Order } from "../entity/order.entity";

const recieptRepo = myDataSource.getRepository(Receipt)
const timeReceiptRepo = myDataSource.getRepository(TimeReceipt)
const productRepo = myDataSource.getRepository(Product)
const financeRepo = myDataSource.getRepository(Finance)
const orderRepo = myDataSource.getRepository(Order)

const createOuterReceipt = async (req:Request, res:Response)=>{
    const {orderData} = req.body
    const updatedOrders = []
    let updatedProducts = null;
    let orders = [];
    if(orderData.length>0){
        let cost = 0; 
        let ordersCount = 0 
        const cashier = "Test Name";
        for(const item of orderData){
            const product = await productRepo.findOne({where:{id: item.id}})
            if(product) {
                ordersCount ++;
                cost += product.price *  item.quantity
                const stock = product.stock - item.quantity;
                const consumed = product.consumed + item.quantity;
                const updateProductsData:addProductDto = Object.assign(product, {stock, consumed}) 
                let order_cost = product.price *  item.quantity
                const orderCreate = orderRepo.create({product_id: product.id, quantity: item.quantity, cost: order_cost})
                const saveOrder = await orderRepo.save(orderCreate)
                updatedProducts = await productRepo.save(updateProductsData)
                updatedOrders.push({...item, order_cost})
                orders.push(saveOrder) 
            }
        }

        const strData = JSON.stringify(orders)
        const financeData = financeRepo.create({finances: cost, type: "outerReceipt", description: `${cashier} أضاف فاتورة جديدة:  ${ordersCount} طلبات وإجمالي ${cost}`, username: cashier})
        const finance = await financeRepo.save(financeData);

        const receiptData = recieptRepo.create({cashier, orders: strData, total: cost})
        const receipt = await recieptRepo.save(receiptData)

        
        res.json({success:true, orders, message: "تم الطلب بنجاح", receipt, finance, updatedProducts})
    }else{
        res.json({success: false, message: "لا يوجد طلبات"})
    }
}

const allOuterReceipts = async (req:Request, res:Response)=>{
    const receipts = await recieptRepo.find()
    res.json({receipts})
}

const findOuterReceipt = async (req:Request, res:Response)=>{
    const {id} = req.params
    const receipt = await recieptRepo.findOne({where: {id}})
    res.json({receipt})
}

const allSessionReceipts = async (req:Request, res:Response)=>{
    const timeReceipts = await timeReceiptRepo.find()
    res.json({timeReceipts})
}

const findSessionReceipt = async (req:Request, res:Response)=>{
    const {id} = req.params
    const timeReceipt = await timeReceiptRepo.findOne({where:{id}})
    res.json({timeReceipt})
}


export {
    createOuterReceipt,
    allOuterReceipts,
    findOuterReceipt,
    allSessionReceipts,
    findSessionReceipt
}