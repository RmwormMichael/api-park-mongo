const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'restapi'
    });
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
