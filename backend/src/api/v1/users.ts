import {Router} from 'express';
import {   usersHandler,updateUser, deleteAccount, updateUserRole, deleteUserId, } from '../../handlers/users';

import { routeAuth } from '../../middlewares/routeAuth';
import { adminAuth } from '../../middlewares/adminAuth';
import {updateLimiter} from "../../middlewares/RateLimitters"
 const router =Router();

router.get("/",routeAuth,adminAuth,usersHandler);



router.patch("/profile/update", routeAuth,updateLimiter,updateUser)
router.delete("/profile/delete",routeAuth,updateLimiter,deleteAccount)



router.patch("/:id/role",routeAuth,adminAuth,updateLimiter, updateUserRole)
router.delete("/:id",routeAuth,adminAuth,updateLimiter,deleteUserId)
export default router;
