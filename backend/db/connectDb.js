const mongoose = require("mongoose");
require("dotenv").config(); // Load .env variables at the start

const connectDb = async () => {
  try {
    console.log(process.env.MONGO_URI)
    const conn =await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected successfully ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDb;
