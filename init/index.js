const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wlust";

// 🔹 MongoDB Connection with Error Handling
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Exit if MongoDB connection fails
    }
}

connectDB();

const initDB = async () => {
    await Listing.deleteMany();
    const modifiedData = initData.data.map(obj => ({
        ...obj,
        owner: "67c141946466a1c00b60097f"
    }));
    await Listing.insertMany(modifiedData);
    console.log("data was initialized");
}

initDB();

module.exports = { connectDB, initDB };