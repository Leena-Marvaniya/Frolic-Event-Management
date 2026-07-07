const Group = require("../models/Group");
const Participant = require("../models/Participant");

// ================= GET GROUPS BY EVENT =================
exports.getGroupsByEvent = async (req, res, next) => {
    try {
        const data = await Group.find({
            EventID: req.params.eventId
        });

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        next(error);
    }
};

// ================= CREATE GROUP =================
exports.createGroup = async (req, res, next) => {
    try {
        const data = await Group.create({
            GroupName: req.body.GroupName,
            EventID: req.params.eventId
        });

        res.status(201).json({
            success: true,
            data
        });

    } catch (error) {
        next(error);
    }
};

// ================= GET MY GROUPS =================
exports.getMyGroups = async (req, res, next) => {
    try {

        const participants = await Participant.find({
            UserID: req.user._id
        }).populate("GroupID");

        const groups = participants.map(p => p.GroupID);

        res.status(200).json({
            success: true,
            data: groups
        });

    } catch (err) {
        next(err);
    }
};

// ================= JOIN GROUP =================
exports.joinGroup = async (req, res, next) => {
    try {

        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        const already = await Participant.findOne({
            GroupID: req.params.groupId,
            UserID: req.user._id
        });

        if (already) {
            return res.status(400).json({
                success: false,
                message: "You already joined this group"
            });
        }

        const participant = await Participant.create({
            ParticipantName: req.user.UserName,
            ParticipantEmail: req.user.EmailAddress,
            UserID: req.user._id,
            GroupID: req.params.groupId
        });

        res.status(201).json({
            success: true,
            message: "Joined successfully",
            data: participant
        });

    } catch (error) {
        next(error);
    }
};

// ================= UPDATE =================
exports.updateGroup = async (req, res, next) => {
    try {
        const data = await Group.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        next(error);
    }
};

// ================= DELETE =================
exports.deleteGroup = async (req, res, next) => {
    try {
        await Participant.deleteMany({ GroupID: req.params.id });
        await Group.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true
        });

    } catch (error) {
        next(error);
    }
};