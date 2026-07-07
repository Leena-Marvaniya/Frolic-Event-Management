const Department = require("../models/Department");

exports.createDepartment = async (req, res, next) => {
    try {
        const exists = await Department.findOne({
            DepartmentName: req.body.DepartmentName,
            InstituteID: req.body.InstituteID
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Department already exists in this institute",
                data: null
            });
        }

        const data = await Department.create(req.body);

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};


exports.getAllDepartments = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sort || "-createdAt";

        const data = await Department.find()
            .populate("InstituteID")
            .populate("DepartmentCoOrdinatorID")
            .populate("ModifiedBy")
            .sort(sortBy)
            .skip(skip)
            .limit(limit);

        const total = await Department.countDocuments();

        res.status(200).json({
            success: true,
            message: "Departments fetched successfully",
            total,
            page,
            data
        });

    } catch (err) {
        next(err);
    }
};


exports.getDepartmentById = async (req, res, next) => {
    try {
        const data = await Department.findById(req.params.id)
            .populate("InstituteID")
            .populate("DepartmentCoOrdinatorID")
            .populate("ModifiedBy");

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
                data: null
            });
        }

        res.status(200).json({
            success: true,
            message: "Department fetched successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};


exports.updateDepartment = async (req, res, next) => {
    try {
        const data = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
                data: null
            });
        }

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};


exports.deleteDepartment = async (req, res, next) => {
    try {
        const data = await Department.findById(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
                data: null
            });
        }

        await Department.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Department deleted successfully",
            data: null
        });

    } catch (err) {
        next(err);
    }
};
