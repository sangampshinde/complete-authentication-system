import AppDataSource from "../data-source.js";
import bcryptjs from "bcryptjs";
import crypto from 'crypto';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {sendVerificationEmail,sendWelcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail} from "../mailtrap/email.js"
import { MoreThan, MoreThanOrEqual } from "typeorm";

export const signup = async (req, res) => {

    const { email, password, name } = req.body

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

    const { email, password } = req.body;

    try {

        const userRepository = AppDataSource.getRepository("User");

        const user = await userRepository.findOne({
            where: { email },
        });

        if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();

       await userRepository.save(user);

       const { password: _, ...userWithoutPassword } = user;

       res.status(200).json({
            success: true,
			message: "Logged in successfully",
            user: userWithoutPassword,
       })
  
    } catch (error) {
        console.log("Error in login ", error);
        res.status(400).json({ success: false, message: error.message });
    }


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

export const forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const userRepository = AppDataSource.getRepository("User");

        const user = await userRepository.findOne({
            where: { email },
        });

        if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await userRepository.save(user);

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });


        
    } catch (error) {

        console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
        
    }


}

export const resetPassword = async (req, res) => {

    try {

        const { token } = req.params;
		const { password } = req.body;

        const userRepository = AppDataSource.getRepository("User");

        const user = await userRepository.findOne({
        where: {
            resetPasswordToken: token,
            resetPasswordExpiresAt: MoreThan(new Date()),
        },
        });

        if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpiresAt = null;

        await userRepository.save(user);

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
        
    } catch (error) {

        console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
        
    }

}

export const checkAuth = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository("User");

        const user = await userRepository.findOne({
          where: { id: req.userId },
        });

        if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

        const { password, ...safeUser } = user;

         res.status(200).json({ success: true, user: safeUser });




        
    } catch (error) {

        console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
        
    }
}


 
