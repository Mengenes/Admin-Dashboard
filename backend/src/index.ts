import 'dotenv/config';
import express  from 'express';
import type {Request,Response} from 'express';
import userRoute from  './api/v1/users';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './api/v1/auth';
import ordersRoute from "./api/v1/orders"
import productsRoute from "./api/v1/products"
import dashboardRoute from "./api/v1/dashboard"
const app= express();

const PORT= process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/orders', ordersRoute);
 app.use('/api/v1/products', productsRoute);
 app.use('/api/v1/dashboard', dashboardRoute);
app.get('/',(req:Request,res:Response)=>{
    res.send('Hello Main Server');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

