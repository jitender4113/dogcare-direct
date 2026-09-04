const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Inventory = require("./models/Inventory");
const inventoryCategories = require("./constants/inventoryCategories");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Home route
app.get("/", (req, res) => {
    res.send("DogCare Direct Server is running");
});

// User model
const User = require("./models/User");

// Create User
app.post("/api/users", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save user to MongoDB
        const savedUser = await user.save();

        // Send response without password
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create user",
            error: error.message,
        });
    }
});

// Login User
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
});

app.post("/api/inventory", async(req,res)=>{
    try {
        const {
            name,
            category,
            subCategory,
            quantity,
            minimumRequired,
            unit
        } = req.body;

        const allowedSubCategories = inventoryCategories[category];

        if(!allowedSubCategories){
            return res.status(400).json({
                message: "Invalid inventory category"
            });
        }

        if(!allowedSubCategories.includes(subCategory)){
            return res.status(400).json({
                message: `Invalid subCategory "${subCategory}" for category "${category}"`,
            });
        }

        const item = new Inventory({
            name,
            category,
            subCategory,
            quantity,
            minimumRequired,
            unit
        });

        const savedItem = await item.save();

        res.status(201).json({
            message: "Inventory item added succesfully",
            item: savedItem
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to add inventory item",
            error: error.message
        });
    }
})

app.get("/api/inventory", async(req,res) =>{
    try {
        const items = await Inventory.find();

        const inventory = items.map((item) => {

            const neededQuantity = Math.max(
                item.minimumRequired - item.quantity,
                0
            );

            const stockPercentage = Math.min(
                Math.round((item.quantity / item.minimumRequired) * 100),
                100
            );

            return {
                ...item.toObject(),
                needRestock: neededQuantity > 0,
                neededQuantity,
                stockPercentage
            };
        });

        const categorySummary = {};

        inventory.forEach((item) => {

            if (!categorySummary[item.category]) {

                categorySummary[item.category] = {
                    category: item.category,
                    totalQuantity: 0,
                    totalRequired: 0,
                    neededQuantity: 0,
                    stockPercentage: 0
                };
            }

            categorySummary[item.category].totalQuantity += item.quantity;
            categorySummary[item.category].totalRequired += item.minimumRequired;
            categorySummary[item.category].neededQuantity += item.neededQuantity;

        });

        Object.values(categorySummary).forEach((category) => {
            if (category.totalRequired > 0) {
                category.stockPercentage = Math.min(
                    Math.round(
                        (category.totalQuantity / category.totalRequired) * 100
                    ),
                    100
                );
            }
        });

        const subCategorySummary = {};

        inventory.forEach((item) => {
            const key = `${item.category}-${item.subCategory}`;

            if (!subCategorySummary[key]) {
                subCategorySummary[key] = {
                    category: item.category,
                    subCategory: item.subCategory,
                    totalQuantity: 0,
                    totalRequired: 0,
                    neededQuantity: 0,
                    stockPercentage: 0
                };
            }

            subCategorySummary[key].totalQuantity += item.quantity;
            subCategorySummary[key].totalRequired += item.minimumRequired;
            subCategorySummary[key].neededQuantity += item.neededQuantity;
        });

        Object.values(subCategorySummary).forEach((item) => {
            if (item.totalRequired > 0) {
                item.stockPercentage = Math.min(
                    Math.round(
                        (item.totalQuantity / item.totalRequired) * 100
                    ),
                    100
                );
            }
        });

        res.status(200).json({
    message: "Inventory fetched successfully",
    items: inventory,
    categorySummary: Object.values(categorySummary),
    subCategorySummary: Object.values(subCategorySummary),
    inventoryCategories
});

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch inventory",
            error: error.message
        });
    }
})

app.put("/api/inventory/:id", async (req,res) => {
    try{
        const {name, category, subCategory, quantity, minimumRequired, unit} = req.body;

        const allowedSubCategories = inventoryCategories[category];

        if (!allowedSubCategories) {
            return res.status(400).json({
                message: "Invalid inventory category"
            });
        }

        if (!allowedSubCategories.includes(subCategory)) {
            return res.status(400).json({
                message: `Invalid subcategory "${subCategory}" for category "${category}"`,
                allowedSubCategories
            });
        }

        const updateItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            {
                name,
                category,
                subCategory,
                quantity,
                minimumRequired,
                unit
            },
            {new: true, runValidators: true}
        );

        if(!updateItem){
            return res.status(404).json({
                message: "Inventory item not found"
            });
        }

        res.status(200).json({
            message: "Inventory updated successfully",
            item: updateItem
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update inventory",
            error: error.message
        });
    }
});

app.delete("/api/inventory/:id", async(req,res) =>{
    try {
        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);

        if(!deletedItem){
            return res.status(404).json({
                message: "Inventory item not found"
            });
        }

        res.status(200).json({
            message: "Inventory item deleted successfully",
            item: deletedItem
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete inventory item",
            error: error.message
        });
    }
})

// Connect MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });