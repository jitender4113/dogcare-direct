const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            // No hardcoded enum — categories are dynamic and validated
            // against MongoDB (see POST/PUT /api/inventory in server.js).
            type: String,
            required: true,
            trim: true,
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