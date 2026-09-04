const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Food",
                "Medicine",
                "Essentials",
                "Medical Supplies",
                "Hygiene & Cleaning",
                "Other"
            ],
        },

        subCategory: {
            type: String,
            required: true,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
        },

        minimumRequired: {
            type: Number,
            required: true,
            min: 0,
        },

        unit: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Inventory", inventorySchema);