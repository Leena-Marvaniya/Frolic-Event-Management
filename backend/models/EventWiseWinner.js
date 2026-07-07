const mongoose = require("mongoose");

const eventWiseWinnerSchema = new mongoose.Schema(
{
    EventID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    GroupID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },

    Sequence: {
        type: Number,
        required: true,
        enum: [1, 2, 3]   
    },

    ModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},
{
    timestamps: true
}
);

eventWiseWinnerSchema.index(
    { EventID: 1, Sequence: 1 },
    { unique: true }
);

module.exports = mongoose.model("EventWiseWinner", eventWiseWinnerSchema);


