import express from 'express'
import { login, logout, signup,verifyEmail,forgotPassword,resetPassword,checkAuth } from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

// SIGNUP
router.post('/signup',signup)

// LOGIN
router.post('/login',login)

// LOGOUT
router.post('/logout',logout)

// VERIFY EMAIL
router.post("/verify-email", verifyEmail);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD
router.post("/reset-password/:token", resetPassword);

// 
router.get("/check-auth", verifyToken, checkAuth);










export default router;