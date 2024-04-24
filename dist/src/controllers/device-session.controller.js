"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endDeviceSession = exports.addDeviceSession = exports.allDeviceSessions = exports.changeTime = exports.findDeviceSession = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const device_entity_1 = require("../entity/device.entity");
const order_entity_1 = require("../entity/order.entity");
const finances_entity_1 = require("./../entity/finances.entity");
const time_order_entity_1 = require("../entity/time-order.entity");
const device_session_entity_1 = require("../entity/device-session.entity");
const device_type_entity_1 = require("../entity/device-type.entity");
const time_receipt_entity_1 = require("./../entity/time-receipt.entity");
const sessionRepo = app_data_source_1.myDataSource.getRepository(device_session_entity_1.DeviceSession);
const deviceRepo = app_data_source_1.myDataSource.getRepository(device_entity_1.Device);
const orderRepo = app_data_source_1.myDataSource.getRepository(order_entity_1.Order);
const financeRepo = app_data_source_1.myDataSource.getRepository(finances_entity_1.Finance);
const timeOrderRepo = app_data_source_1.myDataSource.getRepository(time_order_entity_1.TimeOrder);
const devTypeRepo = app_data_source_1.myDataSource.getRepository(device_type_entity_1.DeviceType);
const TimeReceiptRepo = app_data_source_1.myDataSource.getRepository(time_receipt_entity_1.TimeReceipt);
const findDeviceSession = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const session = yield sessionRepo.find({ where: { id } });
    session ? res.json({ success: true, session }) : res.json({ success: false, message: "حدث خطا" });
});
exports.findDeviceSession = findDeviceSession;
const changeTime = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { play_type, time_type } = req.body;
    const session = yield sessionRepo.findOne({ where: { id } });
    if (session) {
        const device = yield deviceRepo.findOne({ where: { id: session.device_id } });
        let cost = 0;
        const start_at = Date.now();
        const deviceType = yield devTypeRepo.findOne({ where: { id: device === null || device === void 0 ? void 0 : device.type } });
        if (deviceType) {
            if (session.play_type == "single") {
                const timePrice = deviceType.single_price / 12;
                if (timePrice)
                    cost = (Date.parse(session.end_at.toString()) - Date.parse(session.start_at)) / (1000 * 60 * 5) * timePrice;
            }
            else {
                const timePrice = deviceType.multi_price / 12;
                if (timePrice)
                    cost = (Date.parse(session.end_at.toString()) - Date.parse(session.start_at)) / (1000 * 60 * 5) * timePrice;
            }
        }
        const timeData = { session_id: id, play_type, time_type, cost, start_at: session.start_at };
        const time_order = timeOrderRepo.create(timeData);
        const savedTimeOrder = yield timeOrderRepo.save(time_order);
        const newSession = Object.assign(session, Object.assign(Object.assign({}, session), { start_at, play_type, time_type }));
        const updatedSession = yield sessionRepo.save(newSession);
        savedTimeOrder && updatedSession ? res.json({ message: "تم التحديث", success: true })
            : res.json({ message: "حدث خطأ", success: false });
    }
});
exports.changeTime = changeTime;
const allDeviceSessions = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const sessions = yield sessionRepo.find();
    res.json({ sessions });
});
exports.allDeviceSessions = allDeviceSessions;
const addDeviceSession = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { play_type, time_type, end_time } = req.body;
    const { id } = req.params;
    const device = yield deviceRepo.findOne({ where: { id } });
    if (device) {
        const updateDeviceData = Object.assign(Object.assign(Object.assign({}, device), { status: false }));
        const updated = yield deviceRepo.save(updateDeviceData);
        const sessionData = { device_id: device.id, end_at: end_time, time_type, play_type };
        const session = sessionRepo.create(sessionData);
        const created = yield sessionRepo.save(session);
        res.json({ success: true, created, updated, message: "تم بدأ الجهاز بنجاح" });
    }
});
exports.addDeviceSession = addDeviceSession;
const endDeviceSession = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const username = req.cookies.username;
    const { id } = req.params;
    let deviceStatus = false;
    const session = yield sessionRepo.findOne({ where: { id } });
    if (session) {
        const device = yield deviceRepo.findOne({ where: { id: session.device_id } });
        if (device) {
            // UPDATE DEVICE STATE
            const deviceData = Object.assign(Object.assign(Object.assign({}, device), { name: device.name, type: device.type, status: deviceStatus }));
            const updatedDevice = yield deviceRepo.save(deviceData);
            // SENDING FINAL TIME ORDER BEFORE CALCULATING ALL TIME ORDERS
            const timeDiff = Date.now() - new Date(session.start_at).getTime() / (1000 * 60 * 5);
            let finalOrderCost = null;
            let finalTimeOrder = null;
            const deviceType = yield devTypeRepo.findOne({ where: { id: device.type } });
            if (deviceType) {
                if (session.time_type == "single") {
                    finalOrderCost = timeDiff * (deviceType.single_price / 12);
                }
                else {
                    finalOrderCost = timeDiff * (deviceType.multi_price / 12);
                }
            }
            if (finalOrderCost) {
                const createOrder = timeOrderRepo.create({ session_id: session.id, start_at: session.start_at, play_type: session.play_type, cost: finalOrderCost });
                finalTimeOrder = yield timeOrderRepo.save(createOrder);
            }
            //  COUNTING ORDERS AND CALCULATING COSTS
            const orders = yield orderRepo.find({ where: { device_session_id: session.id } });
            const timeOrders = yield timeOrderRepo.find({ where: { session_id: session.id } });
            let total = 0;
            let ordersCount = 0;
            if (orders.length > 0) {
                orders.map((order) => {
                    total = +order.cost;
                    ordersCount++;
                });
            }
            if (timeOrders.length > 0 && finalTimeOrder) {
                timeOrders.map((timeOrder) => total += timeOrder.cost);
            }
            // FINANCES OPERATIONS
            let description = `${username} Ended Device: ${device.name}, With ${ordersCount} Orders, and with Total of ${total}`;
            const financeData = { finances: total, type: "Device", description, username };
            const finance = financeRepo.create(financeData);
            const addedFinance = yield financeRepo.save(finance);
            // TIME ORDERS RECEIPT
            const timeReceiptData = TimeReceiptRepo.create({ orders: orders.toString(), time_orders: timeOrders.toString(), total, cashier: username });
            const timeReceipt = yield TimeReceiptRepo.save(timeReceiptData);
            // SESSION DELETED
            const deletedSession = yield sessionRepo.remove(session);
            // RESPONSE
            res.json({ success: true, deletedSession, updatedDevice, addedFinance, timeReceipt, message: "تم ايقاف الجهاز بنجاح" });
        }
        else
            res.json({ success: false, message: "حدث خطأ" });
    }
    else
        res.json({ success: false, message: "حدث خطأ" });
});
exports.endDeviceSession = endDeviceSession;
//# sourceMappingURL=device-session.controller.js.map