const Institute = require("../models/Institute");
const Department = require("../models/Department");

exports.createInstitute = async (req, res, next) => {
    try {
        const data = await Institute.create(req.body);

        res.status(201).json({
            success: true,
            message: "Institute created successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};


exports.getAllInstitutes = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sort || "-createdAt";

        const data = await Institute.find()
            .populate("InsituteCoOrdinatorID")
            .populate("ModifiedBy")
            .sort(sortBy)
            .skip(skip)
            .limit(limit);

        const total = await Institute.countDocuments();

        res.json({
            success: true,
            message: "Institutes fetched successfully",
            total,
            page,
            data
        });

    } catch (err) {
        next(err);
    }
};


exports.getInstituteById = async (req, res, next) => {
    try {
        const data = await Institute.findById(req.params.id)
            .populate("InsituteCoOrdinatorID")
            .populate("ModifiedBy");

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Institute not found",
                data: null
            });
        }

        res.json({
            success: true,
            message: "Institute fetched successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};


exports.getDepartmentsByInstitute = async (req, res, next) => {
    try {
        const departments = await Department.find({
            InstituteID: req.params.id
        });

        res.status(200).json({
            success: true,
            message: "Departments fetched successfully",
            data: departments
        });

    } catch (err) {
        next(err);
    }
};

exports.updateInstitute = async (req, res, next) => {
    try {
        const data = await Institute.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Institute not found",
                data: null
            });
        }

        res.json({
            success: true,
            message: "Institute updated successfully",
            data
        });

    } catch (err) {
        next(err);
    }
};


exports.deleteInstitute = async (req, res, next) => {
    try {
        await Department.deleteMany({ InstituteID: req.params.id });
        await Institute.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Institute and related departments deleted successfully",
            data: null
        });

    } catch (err) {
        next(err);
    }
};


