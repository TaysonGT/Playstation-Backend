"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDevice = exports.updateDevice = exports.addDevice = exports.allDevices = exports.findDeviceType = exports.updateDeviceType = exports.addDeviceType = exports.allDeviceTypes = exports.findDevice = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const device_entity_1 = require("../entity/device.entity");
const session_entity_1 = require("../entity/session.entity");
const device_type_entity_1 = require("../entity/device-type.entity");
const deviceRepo = app_data_source_1.myDataSource.getRepository(device_entity_1.Device);
const sessionRepo = app_data_source_1.myDataSource.getRepository(session_entity_1.Session);
const devTypeRepo = app_data_source_1.myDataSource.getRepository(device_type_entity_1.DeviceType);
const findDevice = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const device = yield deviceRepo.findOne({ where: { id } });
    if (device) {
        const session = yield sessionRepo.find({ where: { device_id: id } });
        res.json({ device, session });
    }
    else
        res.json({ message: "هذا الجهاز غير موجود" });
});
exports.findDevice = findDevice;
const allDevices = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const devices = yield deviceRepo.find();
    if (devices) {
        res.json({ devices });
    }
    else
        res.json({ message: "لا يوجد اجهزة" });
});
exports.allDevices = allDevices;
const addDevice = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { name, type } = req.body;
    const checkExists = yield deviceRepo.findOne({ where: { name } });
    if (name && type) {
        if (!checkExists) {
            const device_type = yield devTypeRepo.findOne({ where: { id: type } });
            if (device_type) {
                const deviceData = deviceRepo.create({ name, type: device_type.id, status: false });
                const device = yield deviceRepo.save(deviceData);
                res.json({ device, message: "تمت إضافة جهاز بنجاح", success: true });
            }
            else
                res.json({ message: "برجاء اعادة ادخال البيانات", success: false });
        }
        else
            res.json({ success: false, message: "هذا الجهاز موجود بالفعل" });
    }
    else
        res.json({ message: "برجاء ادخال كل البيانات", success: false });
});
exports.addDevice = addDevice;
const updateDevice = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, type } = req.body;
    let status = false;
    let deviceData = { name, type, status };
    const device = yield deviceRepo.findOne({ where: { id } });
    if (device) {
        const updatedDevice = Object.assign(device, deviceData);
        const updated = yield deviceRepo.save(updatedDevice);
        res.json({ updated, message: "تم تحديث الجهاز بنجاح" });
    }
    else {
        res.json({ message: "هذا الجهاز غير موجود" });
    }
});
exports.updateDevice = updateDevice;
const deleteDevice = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const device = yield deviceRepo.findOne({ where: { id } });
    if (device) {
        if (device.status == false) {
            const deleted = yield deviceRepo.remove(device);
            res.json({ deleted, message: "تمت إزالة الجهاز بنجاح", success: true });
        }
        else
            res.json({ message: "هذا الجهاز مشغول حاليا برجاء اغلاقه أولا", success: false });
    }
    else {
        res.json({ message: "حدث خطأ", success: false });
    }
});
exports.deleteDevice = deleteDevice;
const addDeviceType = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { name, single_price, multi_price } = req.body;
    const typeData = devTypeRepo.create({ name, single_price, multi_price });
    const savedType = yield devTypeRepo.save(typeData);
    if (savedType) {
        res.json({ message: "تم إضافة نوع جهاز جديد", success: true });
    }
    else
        res.json({ message: "حدث خطأ", success: false });
});
exports.addDeviceType = addDeviceType;
const updateDeviceType = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { singlePrice, multiPrice } = req.body;
    const deviceType = yield devTypeRepo.findOne({ where: { id } });
    let currentSinglePrice = null;
    let currentMultiPrice = null;
    if (deviceType) {
        singlePrice ? currentSinglePrice = singlePrice : currentSinglePrice = deviceType.single_price;
        multiPrice ? currentMultiPrice = multiPrice : currentMultiPrice = deviceType.multi_price;
        const savedDeviceType = yield devTypeRepo.save(Object.assign(deviceType, { single_price: currentSinglePrice, multi_price: currentMultiPrice }));
        singlePrice || multiPrice ? res.json({ success: true, savedDeviceType, message: "تم حفظ التعديلات بنجاح" }) : res.json({ success: false, message: "لم يتم إدخال أي بيانات" });
    }
    else
        res.json({ succes: false, message: "حدث خطأ" });
});
exports.updateDeviceType = updateDeviceType;
const allDeviceTypes = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const deviceTypes = yield devTypeRepo.find();
    deviceTypes.length > 0 ? res.json({ deviceTypes }) : res.json({ message: "برجاء اضافة نوع جهاز من صفحة الاعدادات", success: false });
});
exports.allDeviceTypes = allDeviceTypes;
const findDeviceType = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deviceType = yield devTypeRepo.findOne({ where: { id } });
    if (deviceType) {
        res.json({ deviceType });
    }
    else
        res.json({ message: "حدث خطأ" });
});
exports.findDeviceType = findDeviceType;
//# sourceMappingURL=devices.contoller.js.map