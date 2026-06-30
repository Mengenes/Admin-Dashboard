import {Router} from 'express';

import { routeAuth } from '../../middlewares/routeAuth.js';
import { getUserRolesTotal,getTotalCountDatas,getTopCustomers,getTopSellingProducts } from '../../handlers/dashboard.js';
import {fetchLimitter} from "../../middlewares/RateLimitters.js"


const router =Router();



router.get("/roles",fetchLimitter,getUserRolesTotal)
router.get("/summary",fetchLimitter,getTotalCountDatas )
router.get("/top-products",fetchLimitter,getTopSellingProducts)
router.get("/top-customers",fetchLimitter,getTopCustomers)


export default router;  