import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB as string);
    console.log("Connected to database");
  } catch (error) {
    console.log("Couldn't connect to database: ", error);
  }
};

export default connectToDB;
