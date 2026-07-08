import mongoose from "mongoose";
import crypto from "crypto";
if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};
