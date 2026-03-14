const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We add the dbName option here to FORCE it to use Secure-her
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Secure-her' 
    });
    console.log(`🚀 MongoDB Connected to: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;