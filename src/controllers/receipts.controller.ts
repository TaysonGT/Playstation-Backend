import { Response, Request } from "express";
import { Receipt } from "../entity/reciept.entity";
import { Product } from "../entity/product.entity";
import { myDataSource } from "../app-data-source";
import { Order } from "../entity/order.entity";

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

  const receipt = recieptRepo.create({ cashier:{id: cashier_id}, type: "outer", total });
  await recieptRepo.save(receipt);

  for(let order of ordersWithProduct){
    total += order.product.price * order.quantity;
    const stock = order.product.stock - order.quantity;
    const updateProductsData = Object.assign(order.product, { stock });

    let cost = order.product.price * order.quantity;

    const newOrder = orderRepo.create({ product: order.product, quantity: order.quantity, cost, receipt });
    await orderRepo.save(newOrder);
    await productRepo.save(updateProductsData);
  }

  res.json({ success: true, message: "تم الطلب بنجاح", receipt });
}

const allOuterReceipts = async (req:Request, res:Response)=>{
    const receipts = await recieptRepo
    .createQueryBuilder('receipts')
    .leftJoinAndSelect('receipts.cashier', 'cashier')
    // .limit(20)
    .where('receipts.type = :type', {type: 'outer'})
    .getMany()

    // .find()
    res.json({receipts})
}

const findOuterReceipt = async (req:Request, res:Response)=>{
    const {id} = req.params
    const receipt = await recieptRepo.findOne({where: {id}, relations:{cashier:true, orders: true}})
    res.json({receipt})
}

const allSessionReceipts = async (req:Request, res:Response)=>{
    const timeReceipts = await recieptRepo
    .createQueryBuilder('receipts')
    .leftJoinAndSelect('receipts.time_orders', 'time_orders')
    .leftJoinAndSelect('receipts.cashier', 'cashier')
    .leftJoinAndSelect('receipts.orders', 'orders')
    .leftJoinAndSelect('orders.product', 'product')
    .getMany()
    // find({
    //   where: {type: "session"}, 
    //   relations: {device: true, time_orders: true, orders:true, cashier: true}
    // })
    
    res.json({timeReceipts})
}

const findSessionReceipt = async (req:Request, res:Response)=>{
    const {id} = req.params
    const timeReceipt = await recieptRepo.findOne({where:{id}})
    res.json({timeReceipt})
}


export {
    createOuterReceipt,
    allOuterReceipts,
    findOuterReceipt,
    allSessionReceipts,
    findSessionReceipt
}