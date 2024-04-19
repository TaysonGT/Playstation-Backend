"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.sessionDataSource = new typeorm_1.DataSource({
    type: "better-sqlite3",
    database: '../database/sessions.db',
    entities: ["build/compiled/entity/Sessions.js"],
    logging: true,
    synchronize: true,
    subscribers: [],
    migrations: []
});
//# sourceMappingURL=sessions-data-source.js.map