const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Inventory = require("./models/Inventory");
const Category = require("./models/Category");
const Donation = require("./models/Donation");
const seedCategories = require("./constants/inventoryCategories");
const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Builds the same { CategoryName: [subCategory, ...] } shape the frontend
// already consumes, but sourced from MongoDB instead of a static file.
async function getInventoryCategoriesMap() {
    const categories = await Category.find().sort({ name: 1 });
    const map = {};
    categories.forEach((cat) => {
        map[cat.name] = cat.subCategories;
    });
    return map;
}

// One-time seed: if the Category collection is empty (fresh DB), populate
// it from the old hardcoded list so existing inventory items keep
// validating correctly. Does nothing on subsequent restarts.
async function seedCategoriesIfEmpty() {
    const count = await Category.countDocuments();
    if (count > 0) return;

    const docs = Object.entries(seedCategories).map(([name, subCategories]) => ({
        name,
        subCategories,
    }));

    await Category.insertMany(docs);
    console.log("Seeded categories collection from constants/inventoryCategories.js");
}

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

        // Clean 400s for missing fields, instead of letting bcrypt/Mongoose
        // throw and fall through to a generic 500 below. `role` is
        // intentionally never read from req.body anywhere in this route —
        // the schema default ("user") is the only thing that can apply.
        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required",
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password is required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

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

// Create a new category
app.post("/api/categories", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Category name is required",
            });
        }

        const trimmedName = name.trim();

        const existing = await Category.findOne({ name: trimmedName });
        if (existing) {
            return res.status(409).json({
                message: `Category "${trimmedName}" already exists`,
            });
        }

        const category = new Category({ name: trimmedName, subCategories: [] });
        const savedCategory = await category.save();

        res.status(201).json({
            message: "Category created successfully",
            category: savedCategory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create category",
            error: error.message,
        });
    }
});

// Add a subcategory to an existing category
app.post("/api/categories/:name/subcategories", authMiddleware, async (req, res) => {
    try {
        const { name } = req.params;
        const { subCategory } = req.body;

        if (!subCategory || !subCategory.trim()) {
            return res.status(400).json({
                message: "Subcategory name is required",
            });
        }

        const trimmedSubCategory = subCategory.trim();

        const category = await Category.findOne({ name });
        if (!category) {
            return res.status(404).json({
                message: `Category "${name}" not found`,
            });
        }

        if (category.subCategories.includes(trimmedSubCategory)) {
            return res.status(409).json({
                message: `Subcategory "${trimmedSubCategory}" already exists under "${name}"`,
            });
        }

        category.subCategories.push(trimmedSubCategory);
        const savedCategory = await category.save();

        res.status(201).json({
            message: "Subcategory added successfully",
            category: savedCategory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add subcategory",
            error: error.message,
        });
    }
});

app.post("/api/inventory", authMiddleware, async(req,res)=>{
    try {
        const {
            name,
            category,
            subCategory,
            quantity,
            minimumRequired,
            unit
        } = req.body;

        const categoryDoc = await Category.findOne({ name: category });

        if(!categoryDoc){
            return res.status(400).json({
                message: "Invalid inventory category"
            });
        }

        if(!categoryDoc.subCategories.includes(subCategory)){
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

app.get("/api/inventory", authMiddleware, async(req,res) =>{
    try {
        const items = await Inventory.find();
        const inventoryCategories = await getInventoryCategoriesMap();

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

app.put("/api/inventory/:id", authMiddleware, async (req,res) => {
    try{
        const {name, category, subCategory, quantity, minimumRequired, unit} = req.body;

        const categoryDoc = await Category.findOne({ name: category });

        if (!categoryDoc) {
            return res.status(400).json({
                message: "Invalid inventory category"
            });
        }

        if (!categoryDoc.subCategories.includes(subCategory)) {
            return res.status(400).json({
                message: `Invalid subcategory "${subCategory}" for category "${category}"`,
                allowedSubCategories: categoryDoc.subCategories
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

app.delete("/api/inventory/:id", authMiddleware, async(req,res) =>{
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

const ALLOWED_DONATION_STATUSES = ["Pending", "Confirmed", "Delivered"];

// Create a new donation/order
// Admin-only: create a new donation/order
app.post("/api/donations", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { donorName, shelterName, items, amount, date, status } = req.body;

        if (!donorName || !donorName.trim()) {
            return res.status(400).json({
                message: "Donor name is required",
            });
        }

        if (!shelterName || !shelterName.trim()) {
            return res.status(400).json({
                message: "Shelter name is required",
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "At least one donated item is required",
            });
        }

        const cleanedItems = [];

        for (const item of items) {
            if (!item || !item.name || !item.name.trim()) {
                return res.status(400).json({
                    message: "Each donated item must have a name",
                });
            }

            const quantity = Number(item.quantity);
            if (Number.isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({
                    message: `Item "${item.name}" must have a quantity greater than 0`,
                });
            }

            cleanedItems.push({
                name: item.name.trim(),
                quantity,
                unit: item.unit ? String(item.unit).trim() : "",
            });
        }

        const numericAmount = Number(amount);
        if (amount === undefined || amount === null || Number.isNaN(numericAmount) || numericAmount < 0) {
            return res.status(400).json({
                message: "A valid donation amount is required",
            });
        }

        if (status && !ALLOWED_DONATION_STATUSES.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Allowed values: ${ALLOWED_DONATION_STATUSES.join(", ")}`,
            });
        }

        const donation = new Donation({
            donorName: donorName.trim(),
            shelterName: shelterName.trim(),
            items: cleanedItems,
            amount: numericAmount,
            date: date ? new Date(date) : undefined,
            status: status || "Pending",
        });

        const savedDonation = await donation.save();

        res.status(201).json({
            message: "Donation created successfully",
            donation: savedDonation,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create donation",
            error: error.message,
        });
    }
});

// Public donation history for the Past Orders page — only public-safe
// fields are selected, so there is nothing sensitive to leak even if the
// schema grows later.
app.get("/api/donations", async (req, res) => {
    try {
        const donations = await Donation.find()
            .select("donorName shelterName items amount date status createdAt")
            .sort({ date: -1, createdAt: -1 });

        res.status(200).json({
            message: "Donations fetched successfully",
            donations,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch donations",
            error: error.message,
        });
    }
});

// Summary stats for the Past Orders page
app.get("/api/donations/summary", async (req, res) => {
    try {
        const donations = await Donation.find().select("items shelterName");

        const totalDonations = donations.length;

        const totalItemsDonated = donations.reduce(
            (sum, donation) =>
                sum + donation.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
            0
        );

        const sheltersHelped = new Set(donations.map((donation) => donation.shelterName)).size;

        res.status(200).json({
            message: "Donation summary fetched successfully",
            totalDonations,
            totalItemsDonated,
            sheltersHelped,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch donation summary",
            error: error.message,
        });
    }
});

// Connect MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected");

        await seedCategoriesIfEmpty();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });