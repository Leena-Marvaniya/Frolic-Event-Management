const Event = require("../models/Event");
const Group = require("../models/Group");
const Participant = require("../models/Participant");
const Department = require("../models/Department");


exports.getEventSummary = async (req, res, next) => {
    try {

        const totalGroups = await Group.countDocuments({
            EventID: req.params.id
        });

        const groups = await Group.find({
            EventID: req.params.id
        });

        const groupIds = groups.map(g => g._id);

        const totalParticipants = await Participant.countDocuments({
            GroupID: { $in: groupIds }
        });

        res.status(200).json({
            success: true,
            message: "Event summary fetched successfully",
            data: {
                totalGroups,
                totalParticipants
            }
        });

    } catch (error) {
        next(error);   
    }
};


exports.getInstituteSummary = async (req, res, next) => {
    try {

        const departments = await Department.find({
            InstituteID: req.params.id
        });

        const departmentIds = departments.map(d => d._id);

        const events = await Event.find({
            DepartmentID: { $in: departmentIds }
        });

        const eventIds = events.map(e => e._id);

        const groups = await Group.find({
            EventID: { $in: eventIds }
        });

        const groupIds = groups.map(g => g._id);

        const participantsCount = await Participant.countDocuments({
            GroupID: { $in: groupIds }
        });

        res.status(200).json({
            success: true,
            message: "Institute summary fetched successfully",
            data: {
                eventsCount: events.length,
                participantsCount
            }
        });

    } catch (error) {
        next(error);   
    }
};


