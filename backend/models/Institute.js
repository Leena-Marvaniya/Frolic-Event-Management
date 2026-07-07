const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema(
{
    InstituteName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    InsituteImage: {
        type: String,
        maxlength: 300
    },

    InsituteDescription: {
        type: String,
        maxlength: 1000
    },

    InsituteCoOrdinatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

module.exports = mongoose.model("Institute", instituteSchema);


