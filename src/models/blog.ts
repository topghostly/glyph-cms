import mongoose, { Schema, Types } from "mongoose";

// Define Mark schema
const MarkSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["bold", "italic", "link", "strike", "highlight", "code"],
      required: true,
    },
    attrs: {
      href: String,
    },
  },
  { _id: false }
);

// Define Node schema
const NodeSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "paragraph",
        "heading",
        "bulletList",
        "orderedList",
        "listItem",
        "image",
        "blockquote",
        "codeBlock",
        "text",
      ],
      required: true,
    },
    content: [this], // Recursive Node
    text: String,
    marks: [MarkSchema],
    attrs: {
      level: Number,
      src: String,
      alt: String,
    },
  },
  { _id: false }
);

// Define Blog schema
const BlogSchema = new Schema(
  {
    _localID: {
      type: String,
      required: true,
    },
    content: {
      title: {
        type: String,
        required: true,
      },
      tags: [String],
      mainImage: {
        url: String,
        alt: String,
      },
      mainImageBlobUrl: String,
      body: [NodeSchema],
      conclusion: [NodeSchema],
      links: [String],
    },
    creator: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
export default Blog;
