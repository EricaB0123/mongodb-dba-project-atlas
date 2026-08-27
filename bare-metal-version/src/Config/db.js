const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting with URI:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Atlas");
  } catch (err) {
    console.error("Atlas connection error:", err.message);
  }
};

module.exports = connectDB;
