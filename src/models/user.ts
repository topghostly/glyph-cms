import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  fullname: {
    type: String,
    require: true,
  },
});

const User = mongoose.models.User || mongoose.model("User", userScheme);

export default User;
