const mongoose = require("mongoose");

const donationItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 0.01,
        },

        unit: {
            type: String,
            trim: true,
            default: "",
        },
    },
    { _id: false }
);

const donationSchema = new mongoose.Schema(
    {
        donorName: {
            type: String,
            required: true,
            trim: true,
        },

        shelterName: {
            type: String,
            required: true,
            trim: true,
        },

        // No phone/email/address/payment fields here by design — this
        // schema backs a PUBLIC transparency page (Past Orders), and the
        // payment gateway/Smart Cart are not implemented yet.
        items: {
            type: [donationItemSchema],
            required: true,
            validate: {
                validator: (items) => Array.isArray(items) && items.length > 0,
                message: "At least one donated item is required",
            },
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        date: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Delivered"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Donation", donationSchema);