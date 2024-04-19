"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.myDataSource = new typeorm_1.DataSource({
    type: "better-sqlite3",
    database: '../database/playstation',
    entities: ["dist/src/entity/*.js"],
    logging: true,
    synchronize: true,
    subscribers: [],
    migrations: []
});
//# sourceMappingURL=app-data-source.js.map