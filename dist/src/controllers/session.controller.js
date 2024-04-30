"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endSession = exports.addSession = exports.allSessions = exports.changeDevice = exports.changePlayType = exports.findSession = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const device_entity_1 = require("../entity/device.entity");
const order_entity_1 = require("../entity/order.entity");
const finances_entity_1 = require("../entity/finances.entity");
const time_order_entity_1 = require("../entity/time-order.entity");
const session_entity_1 = require("../entity/session.entity");
const device_type_entity_1 = require("../entity/device-type.entity");
const time_receipt_entity_1 = require("../entity/time-receipt.entity");
const sessionRepo = app_data_source_1.myDataSource.getRepository(session_entity_1.Session);
const deviceRepo = app_data_source_1.myDataSource.getRepository(device_entity_1.Device);
const orderRepo = app_data_source_1.myDataSource.getRepository(order_entity_1.Order);
const financeRepo = app_data_source_1.myDataSource.getRepository(finances_entity_1.Finance);
const timeOrderRepo = app_data_source_1.myDataSource.getRepository(time_order_entity_1.TimeOrder);
const devTypeRepo = app_data_source_1.myDataSource.getRepository(device_type_entity_1.DeviceType);
const TimeReceiptRepo = app_data_source_1.myDataSource.getRepository(time_receipt_entity_1.TimeReceipt);
const findSession = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const session = yield sessionRepo.find({ where: { id } });
    session ? res.json({ success: true, session }) : res.json({ success: false, message: "حدث خطا" });
});
exports.findSession = findSession;
const changeDevice = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { toDevice } = req.body;
    const isBusy = yield sessionRepo.findOne({ where: { device_id: toDevice } });
    const session = yield sessionRepo.findOne({ where: { id } });
    if (session && (session === null || session === void 0 ? void 0 : session.time_type) == "time" && new Date(session === null || session === void 0 ? void 0 : session.end_at) < new Date()) {
        res.json({ message: " لقد انتهى وقت هذا الجهاز بالفعل", success: false });
    }
    else {
        if (session && !isBusy) {
            const device = yield deviceRepo.findOne({ where: { id: session.device_id } });
            const nextDevice = yield deviceRepo.findOne({ where: { id: toDevice } });
            let cost = 0;
            if (device && nextDevice) {
                const start_at = Date.now();
                const deviceType = yield devTypeRepo.findOne({ where: { id: device.type } });
                if (deviceType) {
                    if (session.play_type == "single") {
                        const timePrice = deviceType.single_price;
                        cost = Math.ceil(((start_at - new Date(session.start_at).getTime()) / (1000 * 60 * 60)) * timePrice);
                    }
                    else {
                        const timePrice = deviceType.multi_price;
                        cost = Math.ceil(((start_at - new Date(session.start_at).getTime()) / (1000 * 60 * 60)) * timePrice);
                    }
                }
                const timeData = { session_id: id, play_type: session.play_type, time_type: session.time_type, cost, start_at: session.start_at };
                const time_order = timeOrderRepo.create(timeData);
                const savedTimeOrder = yield timeOrderRepo.save(time_order);
                const prevDeviceData = Object.assign(device, Object.assign(Object.assign({}, device), { status: false }));
                const newDeviceData = Object.assign(nextDevice, Object.assign(Object.assign({}, nextDevice), { status: true }));
                deviceRepo.save(prevDeviceData);
                deviceRepo.save(newDeviceData);
                const newSession = Object.assign(session, Object.assign(Object.assign({}, session), { start_at, device_id: toDevice }));
                const updatedSession = yield sessionRepo.save(newSession);
                savedTimeOrder && updatedSession ? res.json({ message: "تم نقل الحساب لجهاز اخر", success: true })
                    : res.json({ message: "حدث خطأ", success: false });
            }
        }
        else
            res.json({ message: "هذا الجهاز مشغول حاليا", success: false });
    }
});
exports.changeDevice = changeDevice;
const changePlayType = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { play_type } = req.body;
    const session = yield sessionRepo.findOne({ where: { id } });
    if (session && session.time_type == "time" && new Date(session.end_at) < new Date() && play_type) {
        res.json({ message: " لقد انتهى وقت هذا الجهاز بالفعل", success: false });
    }
    else {
        let cost = 0;
        if (session) {
            const device = yield deviceRepo.findOne({ where: { id: session.device_id } });
            const start_at = Date.now();
            const deviceType = yield devTypeRepo.findOne({ where: { id: device === null || device === void 0 ? void 0 : device.type } });
            const timeDiff = (start_at - new Date(session.start_at).getTime()) / (1000 * 60 * 60);
            if (deviceType) {
                if (session.play_type == "single") {
                    const timePrice = deviceType.single_price;
                    cost = Math.ceil(timeDiff * timePrice);
                }
                else {
                    const timePrice = deviceType.multi_price;
                    cost = Math.ceil(timeDiff * timePrice);
                }
            }
            const timeData = { session_id: id, play_type: session.play_type, time_type: session.time_type, cost, start_at: session.start_at };
            const time_order = timeOrderRepo.create(timeData);
            const savedTimeOrder = yield timeOrderRepo.save(time_order);
            const newSession = Object.assign(session, Object.assign(Object.assign({}, session), { play_type, start_at }));
            const updatedSession = yield sessionRepo.save(newSession);
            savedTimeOrder && updatedSession ? res.json({ message: "تم تغيير نوع اللعب", success: true, updatedSession })
                : res.json({ message: "حدث خطأ", success: false });
        }
    }
});
exports.changePlayType = changePlayType;
const allSessions = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const sessions = yield sessionRepo.find();
    res.json({ sessions });
});
exports.allSessions = allSessions;
const addSession = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { play_type, time_type, end_time } = req.body;
    const { id } = req.params;
    const device = yield deviceRepo.findOne({ where: { id } });
    const checkExists = yield sessionRepo.findOne({ where: { device_id: id } });
    if (!checkExists) {
        if (device) {
            if (play_type && time_type) {
                const updateDeviceData = Object.assign(Object.assign(Object.assign({}, device), { status: true }));
                const updated = yield deviceRepo.save(updateDeviceData);
                const sessionData = { device_id: device.id, end_at: end_time, time_type, play_type };
                const session = sessionRepo.create(sessionData);
                const created = yield sessionRepo.save(session);
                res.json({ success: true, created, updated, message: "تم بدأ الجهاز بنجاح" });
            }
            else
                res.json({ success: false, message: "حدث خطأ" });
        }
        else
            res.json({ message: "هذا الجهاز غير موجود" });
    }
    else
        res.json({ message: "هذه الجلسة بدأت بالفعل", succes: false, warning: true });
});
exports.addSession = addSession;
const endSession = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
            let timeDiff = null;
            // SENDING FINAL TIME ORDER BEFORE CALCULATING ALL TIME ORDERS
            if (session.time_type == "open") {
                timeDiff = (new Date().getTime() - new Date(session.start_at).getTime()) / (1000 * 60 * 60);
            }
            else {
                new Date(session.end_at).getTime() > Date.now() ?
                    timeDiff = (Date.now() - new Date(session.start_at).getTime()) / (1000 * 60 * 60)
                    : timeDiff = (new Date(session.end_at).getTime() - new Date(session.start_at).getTime()) / (1000 * 60 * 60);
            }
            let finalOrderCost = null;
            let finalTimeOrder = null;
            const deviceType = yield devTypeRepo.findOne({ where: { id: device.type } });
            if (deviceType) {
                if (session.time_type == "single") {
                    finalOrderCost = timeDiff * deviceType.single_price;
                }
                else {
                    finalOrderCost = timeDiff * deviceType.multi_price;
                }
            }
            if (finalOrderCost) {
                const createOrder = timeOrderRepo.create({ session_id: session.id, start_at: session.start_at, play_type: session.play_type, cost: Math.ceil(finalOrderCost) });
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
            const timeReceiptData = TimeReceiptRepo.create({ orders: JSON.stringify(orders), time_orders: JSON.stringify(timeOrders), total, cashier: username, session_id: session.id });
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
exports.endSession = endSession;
//# sourceMappingURL=session.controller.js.map