const User = require("../models/user.model"); // Ensure correct path
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

const { generateTokenAndSetCookie } = require("../utils/generateCokieeSet");
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require("../mailtrap/email");
const http = require("http");
const nodemailer = require("nodemailer");
require("dotenv").config();
 const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save();

		// jwt
		generateTokenAndSetCookie(res, user._id);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};


const verifyEmail  = async (req, res) => {
    const {code}=req.body;
    try{
        const user=await User.findOne({
            verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
        })
        if(!user){
            return res.status(400).json({success:false, message: "Invalid or expired verification code" })
        }
        user.isVerified=true;
        user.verificationToken=undefined;
        user.verificationTokenExpiresAt=undefined
        await user.save()
        await sendWelcomeEmail(user.email,user.name);
        res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
    }catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user =await User.findOne({email});
        if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
        generateTokenAndSetCookie(res,user._id);
        user.lastLogin=new Date();
        await user.save();
        
		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
    }catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

// Dummy logout function
const logout = async (req, res) => {
    res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
    // res.status(200).send("Logout successful");
};

const forgotPassword  = async (req, res) => {
    const { email } = req.body;
    try{
        const user =await User.findOne({email});
        if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
        const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken=resetToken;
        user.resetPasswordExpiresAt= resetTokenExpiresAt;
        await user.save()
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        
		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    }catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
const resetPassword= async (req,res)=>{
    const { token } = req.params;
    const { password } = req.body;
    try{
        const user= await User.findOne({
            resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
        })
        if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}
        const hashedPassword=await bcryptjs.hash(password,10);
        user.resetPasswordToken=undefined;
        user.resetPasswordExpiresAt=undefined;
        user.password=hashedPassword;
        await user.save();
        await sendResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
const checkAuth =async (req,res)=>{
    try{
        const user= await User.findById(req.userId).select("-password");
        if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
        res.status(200).json({success:true,user})
    }catch(err){
        console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
    }
}
const addCourseDetails = async (req, res) => {
	const { courseName, studentName, studentEmail } = req.body;

	try {
		if (!courseName || !studentName || !studentEmail) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const user = await User.findOne({ email: studentEmail });
		if (!user) {
			return res.status(404).json({ success: false, message: "Student not found" });
		}

		if (!user.courses) {
			user.courses = [];
		}

		user.courses.push({ courseName, studentName });
		await user.save();

		res.status(200).json({
			success: true,
			message: "Course details added successfully",
			courses: user.courses,
		});
	} catch (error) {
		console.log("Error in addCourseDetails ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
module.exports = { signup, login, logout,verifyEmail,forgotPassword ,resetPassword,checkAuth,addCourseDetails};
