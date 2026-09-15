import "reflect-metadata";
import express from 'express';
import { myDataSource } from './app-data-source';
import cors from 'cors';
import { auth } from './middleware/auth.middleware';
import devicesRouter from './routes/devices.router';
import ordersRouter from './routes/orders.router';
import cookieParser from 'cookie-parser';
import BodyParser from 'body-parser';
import userRouter from './routes/users.router'
import sessionRouter from './routes/session.router';
import financeRouter from './routes/finance.router';
import productsRouter from './routes/products.router';
import deviceTypesRouter from './routes/device-types.router';
import configsRouter from './routes/main-configs.router';
import receiptsRouter from './routes/receipts.router';
import authRouter from './routes/auth.router';
import cashRouter from './routes/cash.router';
import * as dotenv from "dotenv";
import 'pg'

dotenv.config()

// Initializing App
const app = express()

const allowedOrigins = process.env.NODE_ENV == 'production' ? process.env.FRONTEND_URL : true

// Middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(BodyParser.json())
app.use(cors({
    credentials: true,
    origin: allowedOrigins,
    methods: ["POST", "GET", "DELETE", "PUT"]
}))
app.use(express.urlencoded({
    extended: true
}))

// Routes
app.use('/auth', authRouter)
app.use('/configs', configsRouter )
app.use(auth)
app.use('/receipts', receiptsRouter)
app.use('/users', userRouter)
app.use('/orders', ordersRouter)
app.use('/devices', devicesRouter )
app.use('/sessions', sessionRouter )
app.use('/device-types', deviceTypesRouter)
app.use('/finances', financeRouter)
app.use('/cash', cashRouter)
app.use('/products', productsRouter )

// Keep for local dev — harmless no-op-ish on Vercel, but guard it so it
// doesn't fire a duplicate/conflicting initialize() call there
if (!process.env.VERCEL) {
  const PORT = parseInt(process.env.PORT || "5000", 10);
  myDataSource.initialize()
    .then(() => {
      console.log("Data source initialized");
      app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Error during data source initialization:", err);
      app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT} (DB not connected)`);
      });
    });
}

export default app;