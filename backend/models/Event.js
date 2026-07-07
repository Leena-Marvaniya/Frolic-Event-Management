const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
{
    EventName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    EventTagline: {
        type: String,
        maxlength: 300
    },

    EventImage: {
        type: String,
        maxlength: 300
    },

    EventDescription: {
        type: String,
        maxlength: 1000
    },

    GroupMinParticipants: {
        type: Number,
        required: true
    },

    GroupMaxParticipants: {
        type: Number,
        required: true
    },

    EventFees: {
        type: Number,
        default: 0
    },

    EventFirstPrice: {
        type: String,
        maxlength: 300
    },

    EventSecondPrice: {
        type: String,
        maxlength: 300
    },

    EventThirdPrice: {
        type: String,
        maxlength: 300
    },

    DepartmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },

    EventCoOrdinatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    EventMainStudentCoOrdinatorName: {
        type: String,
        maxlength: 100
    },

    EventMainStudentCoOrdinatorPhone: {
        type: String,
        maxlength: 100
    },

    EventMainStudentCoOrdinatorEmail: {
        type: String,
        maxlength: 300
    },

    EventLocation: {
        type: String,
        maxlength: 100
    },

    MaxGroupsAllowed: {
        type: Number,
        required: true
    },

    ModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},
{
    timestamps: true   
});

module.exports = mongoose.model("Event", eventSchema);
