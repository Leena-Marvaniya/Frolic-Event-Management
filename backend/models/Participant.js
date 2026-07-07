const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
{
    ParticipantName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    ParticipantEmail: {
        type: String,
        maxlength: 300
    },

    ParticipantEnrollmentNumber: {
        type: String,
        maxlength: 50
    },

    ParticipantInsituteName: {
        type: String,
        maxlength: 200
    },

    ParticipantCIty: {
        type: String,
        maxlength: 100
    },

    ParticipantMobile: {
        type: String,
        maxlength: 20
    },

    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    IsGroupLeader: {
        type: Boolean,
        default: false
    },

    GroupID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Participant", participantSchema);