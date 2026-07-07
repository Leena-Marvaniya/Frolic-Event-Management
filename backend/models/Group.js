const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
{
    GroupName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    EventID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    IsPaymentDone: {
        type: Boolean,
        default: false
    },

    IsPresent: {
        type: Boolean,
        default: false
    },

    ModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},
{
    timestamps: true   
});

module.exports = mongoose.model("Group", groupSchema);

