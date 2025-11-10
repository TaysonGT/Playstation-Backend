import { Response, Request } from "express";
import { Receipt } from "../entity/reciept.entity";
import { Product } from "../entity/product.entity";
import { myDataSource } from "../app-data-source";
import { Order } from "../entity/order.entity";
import { AuthRequest } from "../middleware/auth.middleware";

const recieptRepo = myDataSource.getRepository(Receipt)
const productRepo = myDataSource.getRepository(Product)
const orderRepo = myDataSource.getRepository(Order)

const createOuterReceipt = async (req:AuthRequest, res:Response)=>{
  const { orders } = req.body;
  
  if (orders.length < 1) {
    res.json({ success: false, message: "لا يوجد طلبات" });
    return
  }

  const products = await productRepo.find();

  const cashier = req.user

  if(!cashier){
    res.status(403).json({success: false, message: "المستخدم غير موجود"})
    return;
  }

  for(const order of orders){
    const product = products.find((prod) => prod.id == order.product.id) 

    if(!product) {
      res.json({ success: false, message: `لم يتم العثور على المنتج: ${order.product?.name}`})
      return
    }
    if(!product || product?.stock<order.quantity) {
      res.json({ success: false, message: `كمية ${product?.name} المتاحة اقل من الكمية المطلوبة`})
      return
    }
  }

  const receipt = recieptRepo.create({cashier: {id: cashier.id}, type: "outer", total: 0});
  await recieptRepo.save(receipt);

  let total = 0;

  for(let order of orders){
    total += order.product.price * order.quantity;
    const stock = order.product.stock - order.quantity;
    const updatedProduct = Object.assign(order.product, { stock });
    await productRepo.save(updatedProduct);

    let cost = order.product.price * order.quantity;
    
    const newOrder = orderRepo.create({ product: updatedProduct, quantity: order.quantity, cost, receipt });

    await orderRepo.save(newOrder);
  }
  
  receipt.total = total;
  await recieptRepo.save(receipt);
  
  res.json({ success: true, message: "تم الطلب بنجاح", receipt });
}

const allOuterReceipts = async (req:Request, res:Response)=>{
    const receipts = await recieptRepo
    .createQueryBuilder('receipts')
    .leftJoinAndSelect('receipts.cashier', 'cashier')
    .leftJoinAndSelect('receipts.orders', 'orders')
    .leftJoinAndSelect('orders.product', 'product')
    .where('receipts.type = :type', {type: 'outer'})
    .orderBy('receipts.created_at', 'DESC')
    .getMany()

    res.json({receipts})
}

const findOuterReceipt = async (req:Request, res:Response)=>{
    const {id} = req.params
    const receipt = await recieptRepo.createQueryBuilder('receipt')
    .leftJoinAndSelect('receipt.cashier', 'cashier')
    .leftJoinAndSelect('receipt.orders', 'orders')
    .leftJoinAndSelect('orders.product', 'product')
    .where('receipt.id = :id', {id})
    .andWhere('receipt.type = :type', {type: 'outer'})
    .getOne()

    res.json({receipt})
}

const allSessionReceipts = async (req:Request, res:Response)=>{
    const receipts = await recieptRepo
    .createQueryBuilder('receipts')
    .leftJoinAndSelect('receipts.time_orders', 'time_orders')
    .leftJoinAndSelect('receipts.cashier', 'cashier')
    .leftJoinAndSelect('receipts.orders', 'orders')
    .leftJoinAndSelect('receipts.device', 'receiptDevice')
    .leftJoinAndSelect('time_orders.device', 'timeOrderDevice')
    .leftJoinAndSelect('orders.product', 'product')
    .where('receipts.type = :type', {type: 'session'})
    .orderBy('receipts.created_at', 'DESC')
    .getMany()
    
    res.json({receipts})
}

const allReceipts = async (req:Request, res:Response)=>{
    const {page = '1', limit = '10', type} = req.query
    const numerizedLimit = parseInt(limit as string)
    const numerizedPage = parseInt(page as string)

    const query = recieptRepo
    .createQueryBuilder('receipts')
    .leftJoinAndSelect('receipts.time_orders', 'time_orders')
    .leftJoinAndSelect('receipts.cashier', 'cashier')
    .leftJoinAndSelect('receipts.orders', 'orders')
    .leftJoinAndSelect('receipts.device', 'receiptDevice')
    .leftJoinAndSelect('time_orders.device', 'timeOrderDevice')
    .leftJoinAndSelect('orders.product', 'product')
    .orderBy('receipts.created_at', 'DESC')
    .skip(numerizedLimit*(numerizedPage-1))
    .take(numerizedLimit)

    if(type){
      query.where('receipts.type = :type', {type})
    }

    const [receipts, total] = await query
    .getManyAndCount()

    res.json({receipts, total, page: numerizedPage, limit: numerizedLimit})
}

export const previousReceipts = async (req:AuthRequest, res:Response)=>{
    const {page = '1', limit = '10', type} = req.query
    const numerizedLimit = parseInt(limit as string)
    const numerizedPage = parseInt(page as string)

    const query = recieptRepo
    .createQueryBuilder('receipts')
    .leftJoinAndSelect('receipts.time_orders', 'time_orders')
    .innerJoinAndSelect('receipts.cashier', 'cashier', 'cashier.id = :cashierId', {cashierId: req.user?.id})
    .leftJoinAndSelect('receipts.orders', 'orders')
    .leftJoinAndSelect('receipts.device', 'receiptDevice')
    .leftJoinAndSelect('time_orders.device', 'timeOrderDevice')
    .leftJoinAndSelect('orders.product', 'product')
    .orderBy('receipts.created_at', 'DESC')
    .skip(numerizedLimit*(numerizedPage-1))
    .take(numerizedLimit)

    if(type){
      query.where('receipts.type = :type', {type})
    }

    const [receipts, total] = await query
    .getManyAndCount()

    res.json({receipts, total, page: numerizedPage, limit: numerizedLimit})
}

const findSessionReceipt = async (req:Request, res:Response)=>{
    const {id} = req.params
    const receipt = await recieptRepo.createQueryBuilder('receipt')
    .leftJoinAndSelect('receipt.cashier', 'cashier')
    .leftJoinAndSelect('receipt.device', 'receiptDevice')
    .leftJoinAndSelect('receipt.time_orders', 'time_orders')
    .leftJoinAndSelect('time_orders.device', 'timeOrderDevice')
    .leftJoinAndSelect('receipt.orders', 'orders')
    .leftJoinAndSelect('orders.product', 'product')
    .where('receipt.id = :id', {id})
    .andWhere('receipt.type = :type', {type: 'session'})
    .getOne()
    
    res.json({receipt})
}


export {
    createOuterReceipt,
    allOuterReceipts,
    findOuterReceipt,
    allSessionReceipts,
    allReceipts,
    findSessionReceipt
}