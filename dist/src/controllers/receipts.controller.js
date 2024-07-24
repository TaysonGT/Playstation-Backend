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
    var _a, _b;
    const { orderData } = req.body;
    const products = yield productRepo.find();
    let updatedProducts = null;
    if (orderData.length > 0) {
        let stockCheck = true;
        let updatedOrders = [];
        let cost = 0;
        let ordersCount = 0;
        const cashier = (_a = req.headers.username) === null || _a === void 0 ? void 0 : _a.toString().split(' ')[1];
        const cashier_id = (_b = req.headers.user_id) === null || _b === void 0 ? void 0 : _b.toString().split(' ')[1];
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
                        const saveOrder = yield orderRepo.save(orderCreate);
                        updatedProducts = yield productRepo.save(updateProductsData);
                        updatedOrders.push(saveOrder);
                    }
                }
            }
        }
        if (stockCheck) {
            const strData = JSON.stringify(updatedOrders);
            const financeData = financeRepo.create({ finances: cost, type: "outerReceipt", description: `${cashier} أضاف فاتورة جديدة:  ${ordersCount} طلبات وإجمالي ${cost}`, cashier, cashier_id });
            const finance = yield financeRepo.save(financeData);
            const receiptData = recieptRepo.create({ cashier, cashier_id, orders: strData, total: cost });
            const receipt = yield recieptRepo.save(receiptData);
            res.json({ success: true, updatedOrders, message: "تم الطلب بنجاح", receipt, finance, updatedProducts });
        }
        else
            res.json({ success: false, message: "الكمية المتاحة اقل من الكمية المطلوبة" });
    }
    else
        res.json({ success: false, message: "لا يوجد طلبات" });
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