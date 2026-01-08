import mongoose from "mongoose";

const conntectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGDB_URL);
    console.log("Database Connected Success.");
  } catch (error) {
    console.log("Database connecting error:", error);
  }
};

export default conntectDB;
