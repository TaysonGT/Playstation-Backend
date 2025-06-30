import express from 'express';
import { myDataSource } from './app-data-source';
import cors from 'cors';
import {addUser, userLogin, checkUsers} from './controllers/users.controller';
import { auth } from './middleware/user.auth';
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

// Initializing App
const app = express()

const allowedOrigins = [
    process.env.NODE_ENV == 'production' ? "https://playstation-frotend.vercel.app" : "http://localhost:3000"
]

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
app.post('/login',userLogin)
app.post('/firstuser', addUser )
app.get('/firstuser', checkUsers )
app.use(auth)
app.use('/users', userRouter)
app.use('/orders', ordersRouter)
app.use('/devices', devicesRouter )
app.use('/sessions', sessionRouter )
app.use('/device-types', deviceTypesRouter)
app.use('/finances', financeRouter )
app.use('/products', productsRouter )
app.use('/config', configsRouter )
app.use('/receipts', receiptsRouter)

// Server Running
const initializeDataSource = async ()=>{
    try{
        await myDataSource
        .initialize() 
        .then(()=>{
            console.log("Data Source Has Been Initialized!")
        })
    }catch(error){
        throw new Error("failed to initialize data source")
    }
}

const initializingTimeout = 5000;

const serverInitializationTimeout = setTimeout(()=>{
    console.error("Server Initializing Timed out...")
    process.exit(1)
}, initializingTimeout)

initializeDataSource()
  .then(() => {
      app.listen(5000, () => {
      console.log(`Server running at http://localhost:5000`);
      clearTimeout(serverInitializationTimeout); 
    });
  })
  .catch(err => {
    console.error('Error initializing datasource:', err);
    clearTimeout(serverInitializationTimeout); 
    process.exit(1); 
  });
