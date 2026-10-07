const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema(
    {
        event: {
            name: {
                type: String,
                required: true,
                trim: true,
                maxlength: 120,
            },
            type: {
                type: String,
                required: true,
                trim: true,
                maxlength: 80,
            },
            dateMode: {
                type: String,
                enum: ["single", "range"],
                required: true,
            },
            startDate: {
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            },
            location: {
                type: String,
                required: true,
                trim: true,
                maxlength: 120,
            },
            venue: {
                type: String,
                trim: true,
                maxlength: 160,
            },
        },

        category: {
            type: String,
            enum: ["planner", "performer", "crew"],
            required: true,
            index: true,
        },

        // The fields inside this object depend on the selected category.
        details: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },

        contact: {
            name: {
                type: String,
                required: true,
                trim: true,
                maxlength: 100,
            },
            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
                maxlength: 254,
            },
            phone: {
                type: String,
                required: true,
                trim: true,
                maxlength: 30,
            },
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Requirement", requirementSchema);