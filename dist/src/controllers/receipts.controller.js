"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSessionReceipt = exports.allSessionReceipts = exports.findOuterReceipt = exports.allOuterReceipts = exports.createOuterReceipt = void 0;
const tslib_1 = require("tslib");
const reciept_entity_1 = require("../entity/reciept.entity");
const product_entity_1 = require("../entity/product.entity");
const app_data_source_1 = require("../app-data-source");
const time_receipt_entity_1 = require("../entity/time-receipt.entity");
const finances_entity_1 = require("../entity/finances.entity");
const order_entity_1 = require("../entity/order.entity");
const recieptRepo = app_data_source_1.myDataSource.getRepository(reciept_entity_1.Receipt);
const timeReceiptRepo = app_data_source_1.myDataSource.getRepository(time_receipt_entity_1.TimeReceipt);
const productRepo = app_data_source_1.myDataSource.getRepository(product_entity_1.Product);
const financeRepo = app_data_source_1.myDataSource.getRepository(finances_entity_1.Finance);
const orderRepo = app_data_source_1.myDataSource.getRepository(order_entity_1.Order);
const createOuterReceipt = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { orderData } = req.body;
    const updatedOrders = [];
    let updatedProducts = null;
    let orders = [];
    if (orderData.length > 0) {
        let cost = 0;
        let ordersCount = 0;
        const cashier = "Test Name";
        for (const item of orderData) {
            const product = yield productRepo.findOne({ where: { id: item.id } });
            if (product) {
                ordersCount++;
                cost += product.price * item.quantity;
                const stock = product.stock - item.quantity;
                const consumed = product.consumed + item.quantity;
                const updateProductsData = Object.assign(product, { stock, consumed });
                let order_cost = product.price * item.quantity;
                const orderCreate = orderRepo.create({ product_id: product.id, quantity: item.quantity, cost: order_cost });
                const saveOrder = yield orderRepo.save(orderCreate);
                updatedProducts = yield productRepo.save(updateProductsData);
                updatedOrders.push(Object.assign(Object.assign({}, item), { order_cost }));
                orders.push(saveOrder);
            }
        }
        const strData = JSON.stringify(orders);
        const financeData = financeRepo.create({ finances: cost, type: "outerReceipt", description: `${cashier} أضاف فاتورة جديدة:  ${ordersCount} طلبات وإجمالي ${cost}`, username: cashier });
        const finance = yield financeRepo.save(financeData);
        const receiptData = recieptRepo.create({ cashier, orders: strData, total: cost });
        const receipt = yield recieptRepo.save(receiptData);
        res.json({ success: true, orders, message: "تم الطلب بنجاح", receipt, finance });
    }
    else {
        res.json({ success: false, message: "لا يوجد طلبات" });
    }
});
exports.createOuterReceipt = createOuterReceipt;
const allOuterReceipts = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const receipts = yield recieptRepo.find();
    res.json({ receipts });
});
exports.allOuterReceipts = allOuterReceipts;
const findOuterReceipt = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const receipt = yield recieptRepo.findOne({ where: { id } });
    res.json({ receipt });
});
exports.findOuterReceipt = findOuterReceipt;
const allSessionReceipts = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const timeReceipts = yield timeReceiptRepo.find();
    res.json({ timeReceipts });
});
exports.allSessionReceipts = allSessionReceipts;
const findSessionReceipt = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const timeReceipt = yield timeReceiptRepo.findOne({ where: { id } });
    res.json({ timeReceipt });
});
exports.findSessionReceipt = findSessionReceipt;
//# sourceMappingURL=receipts.controller.js.map