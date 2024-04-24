"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allFinances = void 0;
const tslib_1 = require("tslib");
const app_data_source_1 = require("../app-data-source");
const finances_entity_1 = require("../entity/finances.entity");
const financeRepo = app_data_source_1.myDataSource.getRepository(finances_entity_1.Finance);
const allFinances = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const finances = yield financeRepo.find();
    res.json({ finances });
});
exports.allFinances = allFinances;
//# sourceMappingURL=finances.controller.js.map