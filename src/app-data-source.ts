import { DataSource } from "typeorm";
import { CashCollection } from "./entity/cash-collection.entity";
import { DeductionType } from "./entity/deduction-type.entity";
import { Deduction } from "./entity/deduction.entity";
import { Device } from "./entity/device.entity";
import { DeviceType } from "./entity/device-type.entity";
import { HeadConfig } from "./entity/head-config.entity";
import { Order } from "./entity/order.entity";
import { Product } from "./entity/product.entity";
import { Receipt } from "./entity/receipt.entity";
import { Session } from "./entity/session.entity";
import { TimeOrder } from "./entity/time-order.entity";
import { User } from "./entity/user.entity";
import * as dotenv from 'dotenv'

dotenv.config()

export const myDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // Set to true if you are passing a valid CA certificate
  },
  //Migrations manage the schema; never auto-sync in any environment.
  synchronize: true,
  logging: false,
  entities: [CashCollection, DeductionType, Deduction, Device, DeviceType, HeadConfig, Order, Product, Receipt, Session, TimeOrder, User],
});
