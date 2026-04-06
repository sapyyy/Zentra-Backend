const mongoose = require("mongoose");

// connect to the URI
const connectDB = async (URI) => {
  try {
    await mongoose.connect(URI);
    console.log("Database Connection Successfull");
  } catch (err) {
    console.log(`Database Connection Failed ${err}`);
  }
};

module.exports = connectDB;
