"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigs = exports.saveConfigs = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const head_config_entity_1 = require("../entity/head-config.entity");
const configRepo = app_data_source_1.myDataSource.getRepository(head_config_entity_1.HeadConfig);
const saveConfigs = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { name, phone } = req.body;
    const nameConfig = yield configRepo.findOne({ where: { key: "name" } });
    const phoneConfig = yield configRepo.findOne({ where: { key: "phone" } });
    let savedName = null;
    let savedPhone = null;
    if (name != null && name != "") {
        if (nameConfig) {
            const currentName = Object.assign(nameConfig, { value: name });
            savedName = yield configRepo.save(currentName);
        }
        else {
            const currentName = configRepo.create({ key: "name", value: name });
            savedName = yield configRepo.save(currentName);
        }
    }
    if (phone != null && phone != "") {
        if (phoneConfig) {
            const currentPhone = Object.assign(phoneConfig, { value: phone });
            savedPhone = yield configRepo.save(currentPhone);
        }
        else {
            const currentPhone = configRepo.create({ key: "phone", value: phone });
            savedPhone = yield configRepo.save(currentPhone);
        }
    }
    if ((phone == null || phone == undefined) && (name == null || name == undefined)) {
        res.json({ message: "لم يتم إدخال أي بيانات", success: false });
    }
    else {
        res.json({ message: "تم حفظ البيانات بنجاح", savedPhone, savedName, success: true });
    }
});
exports.saveConfigs = saveConfigs;
const getConfigs = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const nameConfig = yield configRepo.findOne({ where: { key: "name" } });
    const phoneConfig = yield configRepo.findOne({ where: { key: "phone" } });
    res.json({ nameConfig, phoneConfig });
});
exports.getConfigs = getConfigs;
//# sourceMappingURL=main-configs.controller.js.map