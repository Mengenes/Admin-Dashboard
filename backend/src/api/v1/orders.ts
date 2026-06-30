import {Router} from 'express';

import { routeAuth } from '../../middlewares/routeAuth';
import { ordersAuth } from '../../middlewares/ordersAuth';
import {createOrder,getOrders,getOrderById,updateOrderStatus, deleteOrder} from "../../handlers/orders"

const router =Router();

router.post("/",routeAuth,createOrder)
router.get("/",routeAuth,ordersAuth,getOrders)

router.get("/:id",routeAuth,ordersAuth,getOrderById)

router.patch("/:id/status",routeAuth,ordersAuth,updateOrderStatus)
router.delete("/:id",routeAuth,ordersAuth,deleteOrder)



export default router;