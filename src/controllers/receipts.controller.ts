import { Response, Request } from "express";
import { Receipt } from "../entity/reciept.entity";
import { Product } from "../entity/product.entity";
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
  const { orderData } = req.body;
  const products = await productRepo.find();
  let updatedProducts = null;
  if (orderData.length > 0) {
    let stockCheck = true;
    let updatedOrders = [];
    let cost = 0;
    let ordersCount = 0;
    const cashier = req.headers.username?.toString().split(' ')[1];
    const cashier_id = req.headers.user_id?.toString().split(' ')[1];
    for (let x = 0; x < orderData.length; x++) {
      if (stockCheck) {
        let order = orderData[x];
        let product = products.filter((prod) => prod.id == order.product_id)[0];
        if (product) {
          if (order.quantity > product.stock) {
            stockCheck = false;
          }
          else {
            ordersCount++;
            cost += product.price * order.quantity;
            const stock = product.stock - order.quantity;
            const consumed = product.consumed + order.quantity;
            const updateProductsData = Object.assign(product, { stock, consumed });
            let order_cost = product.price * order.quantity;
            const orderCreate = orderRepo.create({ product_id: product.id, product_name: product.name, quantity: order.quantity, cost: order_cost });
            const saveOrder = await orderRepo.save(orderCreate);
            updatedProducts = await productRepo.save(updateProductsData);
            updatedOrders.push(saveOrder);
          }
        }
      }
    }
    if (stockCheck) {
      const strData = JSON.stringify(updatedOrders);
      const financeData = financeRepo.create({ finances: cost, type: "outerReceipt", description: `${cashier} أضاف فاتورة جديدة:  ${ordersCount} طلبات وإجمالي ${cost}`, cashier, cashier_id });
      const finance = await financeRepo.save(financeData);
      const receiptData = recieptRepo.create({ cashier, cashier_id, orders: strData, total: cost });
      const receipt = await recieptRepo.save(receiptData);
      res.json({ success: true, updatedOrders, message: "تم الطلب بنجاح", receipt, finance, updatedProducts });
    } else res.json({ success: false, message: "الكمية المتاحة اقل من الكمية المطلوبة" });
  } else res.json({ success: false, message: "لا يوجد طلبات" });
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