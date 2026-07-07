const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
{
    DepartmentName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    DepartmentImage: {
        type: String,
        maxlength: 300
    },

    DepartmentDescription: {
        type: String,
        maxlength: 1000
    },

    InstituteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institute",
        required: true
    },

    DepartmentCoOrdinatorID: {
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

module.exports = mongoose.model("Department", departmentSchema);
