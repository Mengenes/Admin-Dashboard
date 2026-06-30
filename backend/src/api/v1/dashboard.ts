import {Router} from 'express';

import { routeAuth } from '../../middlewares/routeAuth.js';
import { getUserRolesTotal,getTotalCountDatas,getTopCustomers,getTopSellingProducts } from '../../handlers/dashboard.js';



const router =Router();



router.get("/roles",getUserRolesTotal)
router.get("/summary",getTotalCountDatas )
router.get("/top-products",getTopSellingProducts)
router.get("/top-customers",getTopCustomers)


export default router;  