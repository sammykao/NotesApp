const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
//CONNECT WITH MONGOOSE
const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}

//EXPORT FOR APP.JS FUNCTION
module.exports = connectDB;