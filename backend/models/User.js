const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    UserName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    UserPassword: {
        type: String,
        required: true,
        maxlength: 300   
    },

    EmailAddress: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 300
    },

    PhoneNumber: {
        type: String,
        maxlength: 50
    },

    Role: {
        type: String,
        enum: ["Admin", "Coordinator", "Student"],
        default: "Student"
    }
},
{
    timestamps: true   
});

module.exports = mongoose.model("User", userSchema);


