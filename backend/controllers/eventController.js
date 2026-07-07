const Event = require("../models/Event");

exports.createEvent = async (req, res, next) => {
    try {
        const {
            GroupMinParticipants,
            GroupMaxParticipants,
            MaxGroupsAllowed
        } = req.body;

        if (GroupMinParticipants > GroupMaxParticipants) {
            return res.status(400).json({
                success: false,
                message: "GroupMinParticipants cannot be greater than GroupMaxParticipants",
                data: null
            });
        }

        if (MaxGroupsAllowed <= 0) {
            return res.status(400).json({
                success: false,
                message: "MaxGroupsAllowed must be greater than 0",
                data: null
            });
        }

        const data = await Event.create(req.body);

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data
        });

    } catch (error) {
        next(error);
    }
};


exports.getAllEvents = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};

    
        if (req.query.q) {
            query.EventName = { $regex: req.query.q, $options: "i" };
        }

        
        if (req.query.department) {
            query.DepartmentID = req.query.department;
        }

        
        if (req.query.location) {
            query.Location = req.query.location;
        }

        const sortBy = req.query.sort || "-createdAt";

        const data = await Event.find(query)
            .populate("DepartmentID")
            .populate("EventCoOrdinatorID")
            .populate("ModifiedBy")
            .sort(sortBy)
            .skip(skip)
            .limit(limit);

        const total = await Event.countDocuments(query);

        res.json({
            success: true,
            message: "Events fetched successfully",
            total,
            page,
            data
        });

    } catch (error) {
        next(error);
    }
};


exports.getEventById = async (req, res, next) => {
    try {
        const data = await Event.findById(req.params.id)
            .populate("DepartmentID")
            .populate("EventCoOrdinatorID")
            .populate("ModifiedBy");

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
                data: null
            });
        }

        res.json({
            success: true,
            message: "Event fetched successfully",
            data
        });

    } catch (error) {
        next(error);
    }
};


exports.updateEvent = async (req, res, next) => {
    try {
        const data = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
                data: null
            });
        }

        res.json({
            success: true,
            message: "Event updated successfully",
            data
        });

    } catch (error) {
        next(error);
    }
};


exports.deleteEvent = async (req, res, next) => {
    try {
        const data = await Event.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
                data: null
            });
        }

        res.json({
            success: true,
            message: "Event deleted successfully",
            data: null
        });

    } catch (error) {
        next(error);
    }
};


