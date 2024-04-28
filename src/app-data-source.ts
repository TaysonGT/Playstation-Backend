import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
    type: "better-sqlite3",
    database: '../database/playstation',
    entities: ["dist/src/entity/*.js"],
    logging: true,
    synchronize: true,
    subscribers: [],
    migrations: []
})