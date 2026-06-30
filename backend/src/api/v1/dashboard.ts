import {Router} from 'express';

import { routeAuth } from '../../middlewares/routeAuth';
import { getUserRolesTotal,getTotalCountDatas,getTopCustomers,getTopSellingProducts } from '../../handlers/dashboard';
import {fetchLimitter} from "../../middlewares/RateLimitters"


const router =Router();



router.get("/roles",fetchLimitter,getUserRolesTotal)
router.get("/summary",fetchLimitter,getTotalCountDatas )
router.get("/top-products",fetchLimitter,getTopSellingProducts)
router.get("/top-customers",fetchLimitter,getTopCustomers)


export default router;  