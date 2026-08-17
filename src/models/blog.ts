import mongoose, { Schema } from "mongoose";

const BlogSchema = new Schema(
  {
    _localID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
      index: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
export default Blog;
