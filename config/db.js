const mongoose = require('mongoose');

// suprime o deprecation warning
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
module.exports = connectDB;
