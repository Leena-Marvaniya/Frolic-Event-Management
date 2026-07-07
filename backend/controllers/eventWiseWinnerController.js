const EventWiseWinner = require("../models/EventWiseWinner");


exports.getWinnersByEvent = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sort || "Sequence";

        const query = { EventID: req.params.eventId };

        const data = await EventWiseWinner.find(query)
            .populate("EventID")
            .populate("GroupID")
            .sort(sortBy)
            .skip(skip)
            .limit(limit);

        const total = await EventWiseWinner.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Winners fetched successfully",
            total,
            page,
            data
        });

    } catch (error) {
        next(error);
    }
};


exports.createWinner = async (req, res, next) => {
    try {

        const existing = await EventWiseWinner.findOne({
            EventID: req.params.eventId,
            Sequence: req.body.Sequence
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "This rank already exists for this event",
                data: null
            });
        }

        const data = await EventWiseWinner.create({
            ...req.body,
            EventID: req.params.eventId
        });

        res.status(201).json({
            success: true,
            message: "Winner created successfully",
            data
        });

    } catch (error) {
        next(error);
    }
};


exports.updateWinner = async (req, res, next) => {
    try {

        const winner = await EventWiseWinner.findById(req.params.id);

        if (!winner) {
            return res.status(404).json({
                success: false,
                message: "Winner not found",
                data: null
            });
        }

        if (req.body.Sequence) {
            const duplicate = await EventWiseWinner.findOne({
                EventID: winner.EventID,
                Sequence: req.body.Sequence,
                _id: { $ne: req.params.id }
            });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "Sequence already taken for this event",
                    data: null
                });
            }
        }

        const data = await EventWiseWinner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Winner updated successfully",
            data
        });

    } catch (error) {
        next(error);
    }
};


exports.deleteWinner = async (req, res, next) => {
    try {

        const winner = await EventWiseWinner.findById(req.params.id);

        if (!winner) {
            return res.status(404).json({
                success: false,
                message: "Winner not found",
                data: null
            });
        }

        await EventWiseWinner.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Winner deleted successfully",
            data: null
        });

    } catch (error) {
        next(error);
    }
};


