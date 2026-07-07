const Participant = require("../models/Participant");
const Group = require("../models/Group");

// ================= GET PARTICIPANTS =================
exports.getParticipantsByGroup = async (req, res, next) => {
    try {

        const data = await Participant.find({
            GroupID: req.params.groupId
        });

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        next(error);
    }
};

// ================= CREATE =================
exports.createParticipant = async (req, res, next) => {
    try {

        const group = await Group.findById(req.params.groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        // ✅ already joined check
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

        const data = await Participant.create({
    ParticipantName: req.body.ParticipantName,
    ParticipantEmail: req.body.ParticipantEmail,
    ParticipantEnrollmentNumber: req.body.ParticipantEnrollmentNumber,
    ParticipantInsituteName: req.body.ParticipantInsituteName,
    ParticipantCIty: req.body.ParticipantCIty,
    ParticipantMobile: req.body.ParticipantMobile,
    IsGroupLeader: req.body.IsGroupLeader,

    UserID: req.user._id,
    GroupID: req.params.groupId
});

        res.status(201).json({
            success: true,
            data
        });

    } catch (error) {
        next(error);
    }
};

// ================= UPDATE =================
exports.updateParticipant = async (req, res, next) => {
    try {

        const data = await Participant.findByIdAndUpdate(
            req.params.id,
            {
                ParticipantName: req.body.ParticipantName,
                ParticipantEmail: req.body.ParticipantEmail,
                ParticipantEnrollmentNumber: req.body.ParticipantEnrollmentNumber,
                ParticipantInsituteName: req.body.ParticipantInsituteName,
                ParticipantCIty: req.body.ParticipantCIty,
                ParticipantMobile: req.body.ParticipantMobile,
                IsGroupLeader: req.body.IsGroupLeader
            },
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
exports.deleteParticipant = async (req, res, next) => {
    try {

        await Participant.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true
        });

    } catch (error) {
        next(error);
    }
};