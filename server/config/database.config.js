const mongoose = require("mongoose");

const connectDB = async () => {
  const client = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${client.connection.host}`);
};

module.exports = connectDB;
