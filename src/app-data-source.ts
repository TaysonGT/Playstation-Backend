import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
    type: "better-sqlite3",
    database: __dirname + '/../../database/playstation',
    entities: [__dirname + "/entity/*.{js,ts}"],
    logging: true,
    synchronize: true,
    subscribers: [],
    migrations: []
})