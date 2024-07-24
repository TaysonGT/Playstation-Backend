"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.addOrder = exports.allOuterOrders = exports.sessionOrders = exports.allOrders = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const order_entity_1 = require("../entity/order.entity");
const product_entity_1 = require("./../entity/product.entity");
const device_entity_1 = require("../entity/device.entity");
const time_order_entity_1 = require("../entity/time-order.entity");
const session_entity_1 = require("../entity/session.entity");
const orderRepo = app_data_source_1.myDataSource.getRepository(order_entity_1.Order);
const sessionRepo = app_data_source_1.myDataSource.getRepository(session_entity_1.Session);
const timeOrderRepo = app_data_source_1.myDataSource.getRepository(time_order_entity_1.TimeOrder);
const deviceRepo = app_data_source_1.myDataSource.getRepository(device_entity_1.Device);
const productRepo = app_data_source_1.myDataSource.getRepository(product_entity_1.Product);
const allOrders = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderRepo.find();
    res.json({ orders });
});
exports.allOrders = allOrders;
const allOuterOrders = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderRepo.find();
    let outerOrders = orders.filter((order) => order.device_session_id == null);
    res.json({ outerOrders });
});
exports.allOuterOrders = allOuterOrders;
const sessionOrders = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const orders = yield orderRepo.find({ where: { device_session_id: id } });
    const timeOrders = yield timeOrderRepo.find({ where: { session_id: id } });
    const products = yield productRepo.find();
    let arrangedOrders = [];
    products.map((product) => {
        let entity = {
            product: "",
            cost: 0,
            quantity: 0
        };
        const collected = orders.filter((order) => order.product_id == product.id);
        if (collected.length > 0) {
            entity.product = product.name;
            collected.map((order) => {
                entity.cost += order.cost;
                entity.quantity += order.quantity;
            });
            arrangedOrders.push(entity);
        }
    });
    res.json({ orders, timeOrders, arrangedOrders });
});
exports.sessionOrders = sessionOrders;
const addOrder = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { product_id, quantity } = req.body;
    const { sessionId } = req.params;
    const session = yield sessionRepo.findOne({ where: { id: sessionId } });
    const device = yield deviceRepo.findOne({ where: { id: session === null || session === void 0 ? void 0 : session.device_id } });
    const product = yield productRepo.findOne({ where: { id: product_id } });
    if (product && device) {
        const cost = product.price * quantity;
        let orderData = { product_id, product_name: product.name, quantity, device_session_id: sessionId, device_name: device.name, cost };
        const order = orderRepo.create(orderData);
        const created = yield orderRepo.save(order);
        const stock = product.stock - quantity;
        const consumed = product.consumed + quantity;
        const updateProductsData = Object.assign(product, { stock, consumed });
        const updatedProducts = yield productRepo.save(updateProductsData);
        res.json({ success: true, created, updatedProducts, message: "تمت إضافةالطلب بنجاح" });
    }
    else
        res.json({ success: false, message: "حدث خطأ" });
});
exports.addOrder = addOrder;
const deleteOrder = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield orderRepo.findOne({ where: { id } });
    const product = yield productRepo.findOne({ where: { id: order === null || order === void 0 ? void 0 : order.product_id } });
    if (order && product) {
        const deleted = yield orderRepo.remove(order);
        const stock = product.stock - order.quantity;
        const consumed = product.consumed + order.quantity;
        const updateProductsData = Object.assign(product, { stock, consumed });
        const updatedProducts = yield productRepo.save(updateProductsData);
        res.json({ success: true, deleted, updatedProducts, message: "تم حذف الطلب بنجاح" });
    }
    else {
        res.json({ success: false, message: "هذا الطلب غير موجود" });
    }
});
exports.deleteOrder = deleteOrder;
//# sourceMappingURL=orders.controller.js.map