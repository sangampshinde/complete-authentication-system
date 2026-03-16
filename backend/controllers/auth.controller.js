import AppDataSource from "../data-source.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {sendVerificationEmail,sendWelcomeEmail} from "../mailtrap/email.js"
import { MoreThanOrEqual } from "typeorm";

export const signup = async (req, res) => {

    const { email,password,name } = req.body

    try {

        if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

        const userRepository = AppDataSource.getRepository("User");

        const userAlreadyExists = await userRepository.findOne({
            where: { email },
        });

		console.log("userAlreadyExists", userAlreadyExists);

        if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = userRepository.create({
            email,
			password: hashedPassword,
			name,
            verificationToken,
            verificationTokenExpiresAt:new Date (Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        })

        await userRepository.save(user);

        // JWT
        generateTokenAndSetCookie(res, user.id);

        await sendVerificationEmail(user.email, verificationToken);

        const userPlain = { ...user };
        delete userPlain.password;

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: userPlain
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {

}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {

        const userRepository = AppDataSource.getRepository("User");

         const user = await userRepository.findOne({
            where: { 
                verificationToken: code,
                verificationTokenExpiresAt:MoreThanOrEqual(new Date())
             },
         });

         if(!user){
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
         }

         user.isVerified = true;
         user.verificationToken = undefined;
         user.verificationTokenExpiresAt = undefined;

         await userRepository.save(user);

         await sendWelcomeEmail(user.email, user.name);

         res.status(200).json({
            success:true,
            message: "Email verified successfully",
            user: {
                ...user,
                password: undefined,
            },
         })

    } catch (error) {
        console.log("error in verifyEmail", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
    
}

