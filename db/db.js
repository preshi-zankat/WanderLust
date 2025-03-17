const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;

async function connectDB() {
    try {
      await mongoose.connect(MONGO_URL, {
  
      });
      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error);
      process.exit(1); // Exit if MongoDB connection fails
    }
  }

module.exports = connectDB;  