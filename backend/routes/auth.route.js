import express from 'express'
import { login, logout, signup,verifyEmail } from '../controllers/auth.controller.js'

const router = express.Router()

// SIGNUP
router.post('/signup',signup)

// LOGIN
router.post('/login',login)

// LOGOUT
router.post('/logout',logout)

// VERIFY EMAIL
router.post("/verify-email", verifyEmail);


export default router;