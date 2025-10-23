import { Response, Request } from "express";
import { Receipt } from "../entity/reciept.entity";
import { Product } from "../entity/product.entity";
import { myDataSource } from "../app-data-source";
import { Order } from "../entity/order.entity";
import { User } from "../entity/user.entity";

const userRepo = myDataSource.getRepository(User)
const recieptRepo = myDataSource.getRepository(Receipt)
const productRepo = myDataSource.getRepository(Product)
const orderRepo = myDataSource.getRepository(Order)

const createOuterReceipt = async (req:Request, res:Response)=>{
  const { orderData } = req.body;
  
  if (orderData.length < 1) {
    res.json({ success: false, message: "لا يوجد طلبات" });
    return
  }

  const products = await productRepo.find();

  let stockCheck = true;
  let total = 0;
  const cashier_id = req.headers.user_id?.toString().split(' ')[1];

  const cashier = await userRepo.findOne({where: {id: cashier_id}})
  if(!cashier){
    res.status(403).json({success: false, message: "المستخدم غير موجود"})
    return;
  }

  const ordersWithProduct:{product_id: string, quantity: number, product: Product}[] = orderData.map((order:{product_id: string, quantity: number})=>{
    const product = products.find((prod) => prod.id == order.product_id) 

    if(!product) {
      stockCheck = false
      return
    }

    if(product.stock<order.quantity) {
      stockCheck = false
      return
    }

    return {...order, product}
  })

  if(!stockCheck) {
    res.json({ success: false, message: "الكمية المتاحة اقل من الكمية المطلوبة" })
    return;
  }

  const receipt = recieptRepo.create({cashier, type: "outer", total: 0});
  await recieptRepo.save(receipt);

  for(let order of ordersWithProduct){
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