const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= VERIFY TOKEN =================
exports.verifyToken = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If no token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing",
                data: null
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = await User.findById(decoded.id).select("-UserPassword");

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            data: null
        });
    }
};


// ================= ADMIN ONLY =================
exports.isAdmin = (req, res, next) => {
    if (req.user.Role !== "Admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only.",
            data: null
        });
    }

    next();
};


// ================= ADMIN OR COORDINATOR =================
exports.isAdminOrCoordinator = (req, res, next) => {
    if (req.user.Role !== "Admin" && req.user.Role !== "Coordinator") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin or Coordinator only.",
            data: null
        });
    }

    next();
};