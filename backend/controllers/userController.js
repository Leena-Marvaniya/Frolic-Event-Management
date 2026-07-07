const User = require("../models/User");


exports.createUser = async (req, res, next) => {
    try {
        const data = await User.create(req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data
        });

    } catch (error) {
        next(error);
    }
};


exports.getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sort || "-createdAt";

        const data = await User.find()
            .sort(sortBy)
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            total,
            page,
            data
        });

    } catch (error) {
        next(error);
    }
};


exports.getUserById = async (req, res, next) => {
    try {
        const data = await User.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data
        });

    } catch (error) {
        next(error);
    }
};


exports.updateUser = async (req, res, next) => {
    try {
        const data = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data
        });

    } catch (error) {
        next(error);
    }
};


exports.deleteUser = async (req, res, next) => {
    try {
        const data = await User.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: null
        });

    } catch (error) {
        next(error);
    }
};




