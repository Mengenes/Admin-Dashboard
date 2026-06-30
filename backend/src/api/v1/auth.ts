import {Router} from 'express';
import { createUser,loginUser,logoutUser,tokenUser,forgotPassword,resetPassword,userProfileHandler } from '../../handlers/auth.js';
import { forgotLimiter,resetLimiter, } from '../../middlewares/RateLimitters.js';
import { routeAuth } from '../../middlewares/routeAuth.js';

const router =Router();

router.post("/register",createUser);
router.post("/login",loginUser);
router.post("/refresh",tokenUser);
router.post("/logout",logoutUser);
router.post("/forgot-password", forgotLimiter, forgotPassword);
router.post("/reset-password/:token",resetLimiter, resetPassword);
router.get("/me",routeAuth, userProfileHandler)
export default router;
