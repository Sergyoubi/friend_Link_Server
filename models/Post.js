import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      // ID of who posted the post
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    postPicturePath: String,
    userPicturePath: String,
    likes: {
      // all we have to do is to check wether userId exists or not in the Map() data structure, if it exists the value is always true
      type: Map, // looks like: { "_id": true }
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
