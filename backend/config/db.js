import mongoose from 'mongoose';

/**
 * Establish connection to MongoDB using the URI
 * stored in environment variables.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Using .cyan.underline if you have 'colors' package, 
    // otherwise a standard console.log works great:
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;