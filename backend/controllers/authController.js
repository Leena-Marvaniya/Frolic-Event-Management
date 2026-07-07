const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.Role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// ================= REGISTER =================
exports.register = async (req, res, next) => {
    try {
        const { UserName, EmailAddress, UserPassword, Role } = req.body;

        const existingUser = await User.findOne({ EmailAddress });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
                data: null
            });
        }

        const hashedPassword = await bcrypt.hash(UserPassword, 10);

        const user = await User.create({
            UserName,
            EmailAddress,
            UserPassword: hashedPassword,
            Role
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: null
        });

    } catch (error) {
        next(error);
    }
};

// ================= LOGIN =================
exports.login = async (req, res, next) => {
    try {
        const { EmailAddress, UserPassword } = req.body;

        const user = await User.findOne({ EmailAddress });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                data: null
            });
        }

        const isMatch = await bcrypt.compare(UserPassword, user.UserPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                data: null
            });
        }

        const token = generateToken(user);

        // ✅ IMPORTANT CHANGE HERE
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: token,
                role: user.Role
            }
        });

    } catch (error) {
        next(error);
    }
};

// ================= GET PROFILE =================
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-UserPassword");

        res.status(200).json({
            success: true,
            message: "User profile fetched",
            data: user
        });

    } catch (error) {
        next(error);
    }
};

