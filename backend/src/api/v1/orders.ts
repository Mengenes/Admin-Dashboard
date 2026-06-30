import {Router} from 'express';

import { routeAuth } from '../../middlewares/routeAuth.js';
import { ordersAuth } from '../../middlewares/ordersAuth.js';
import {createOrder,getOrders,getOrderById,updateOrderStatus, deleteOrder} from "../../handlers/orders.js"

const router =Router();

router.post("/",routeAuth,createOrder)
router.get("/",routeAuth,ordersAuth,getOrders)

router.get("/:id",routeAuth,ordersAuth,getOrderById)

router.patch("/:id/status",routeAuth,ordersAuth,updateOrderStatus)
router.delete("/:id",routeAuth,ordersAuth,deleteOrder)



export default router;